package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.CarModel;
import vn.edu.iuh.sv.vcarbe.dto.RentRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class RentalContractServiceImpl implements RentalContractService {
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RentalContractDTO createRentalContract(RentRequest rentRequest, ObjectId lessee) {
        CarModel car = carRepository.findByIdCustom(rentRequest.carId());
        if (car == null) {
            throw new AppException(404, "Car not found with id " + rentRequest.carId());
        }

        RentalContract rentalContract = new RentalContract();
        rentalContract.setCarId(new ObjectId(car.getId()));
        rentalContract.setOwner(new ObjectId(car.getOwner().getId()));
        rentalContract.setLessee(lessee);
        rentalContract.setCreatedAt(new Date());
        // Set individual lessee details if provided
        rentalContract.setLesseeIdentityNumber(rentRequest.lesseeIdentityNumber());
        rentalContract.setLesseePassportNumber(rentRequest.lesseePassportNumber());
        rentalContract.setLesseeLicenseNumber(rentRequest.lesseeLicenseNumber());
        rentalContract.setLesseePermanentAddress(rentRequest.lesseePermanentAddress());
        rentalContract.setLesseeContactAddress(rentRequest.lesseeContactAddress());
        rentalContract.setLesseePhoneNumber(rentRequest.lesseePhoneNumber());

        // Set organization lessee details if provided
        rentalContract.setOrganizationRegistrationNumber(rentRequest.organizationRegistrationNumber());
        rentalContract.setOrganizationHeadquarters(rentRequest.organizationHeadquarters());
        rentalContract.setLegalRepresentativeName(rentRequest.legalRepresentativeName());
        rentalContract.setLegalRepresentativePosition(rentRequest.legalRepresentativePosition());
        rentalContract.setOrganizationPhoneNumber(rentRequest.organizationPhoneNumber());

        // Set rental details
        rentalContract.setRentalStartDate(rentRequest.rentalStartDate());
        rentalContract.setRentalStartHour(rentRequest.rentalStartHour());
        rentalContract.setRentalStartMinute(rentRequest.rentalStartMinute());
        rentalContract.setRentalEndDate(rentRequest.rentalEndDate());
        rentalContract.setRentalEndHour(rentRequest.rentalEndHour());
        rentalContract.setRentalEndMinute(rentRequest.rentalEndMinute());
        rentalContract.setVehicleHandOverLocation(rentRequest.vehicleHandOverLocation());

        // Set pricing details from car
        rentalContract.setRentalPricePerDay(car.getDailyRate());
        rentalContract.setMileageLimitPerDay(car.getMileageLimitPerDay());
        rentalContract.setExtraMileageCharge(car.getExtraMileageCharge());
        rentalContract.setExtraHourlyCharge(car.getExtraHourlyCharge());

        calculateTotalRentalValue(rentalContract);

        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);
        return modelMapper.map(savedRentalContract, RentalContractDTO.class);
    }

    @Override
    public RentalContractDTO getRentalContract(ObjectId id) {
        RentalContract rentalContract = getRentalContractFromRepository(id);
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }

    @Override
    public List<RentalContractDTO> getRentalContractForLessor(ObjectId id, boolean sortDescending) {
        Sort sort = Sort.by(Sort.Order.desc("createAt"));
        if (!sortDescending) {
            sort = Sort.by(Sort.Order.asc("createAt"));
        }
        List<RentalContract> rentalContracts = rentalContractRepository.findByOwner(id, sort);
        return modelMapper.map(rentalContracts, new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public List<RentalContractDTO> getRentalContractForLessee(ObjectId id, boolean sortDescending) {
        Sort sort = Sort.by(Sort.Order.desc("createAt"));
        if (!sortDescending) {
            sort = Sort.by(Sort.Order.asc("createAt"));
        }
        List<RentalContract> rentalContracts = rentalContractRepository.findByLessee(id, sort);
        return modelMapper.map(rentalContracts, new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public RentalContract approveRentalContract(ApprovalRequest approvalRequest) {
        RentalContract rentalContract = getRentalContractFromRepository(approvalRequest.rentalContractId());
        rentalContract.setIsApproved(true);
        rentalContract.setActionTime(new Date());
        return rentalContractRepository.save(rentalContract);
    }

    @Override
    public RentalContract rejectRentalContract(ApprovalRequest approvalRequest) {
        RentalContract rentalContract = getRentalContractFromRepository(approvalRequest.rentalContractId());
        rentalContract.setIsApproved(false);
        rentalContract.setActionTime(new Date());
        return rentalContractRepository.save(rentalContract);
    }

    public RentalContract getRentalContractFromRepository(ObjectId id) {
        return rentalContractRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + id));
    }

    private void calculateTotalRentalValue(RentalContract rentalContract) {
        Calendar startCal = Calendar.getInstance();
        startCal.setTime(rentalContract.getRentalStartDate());
        startCal.set(Calendar.HOUR_OF_DAY, rentalContract.getRentalStartHour());
        startCal.set(Calendar.MINUTE, rentalContract.getRentalStartMinute());

        Calendar endCal = Calendar.getInstance();
        endCal.setTime(rentalContract.getRentalEndDate());
        endCal.set(Calendar.HOUR_OF_DAY, rentalContract.getRentalEndHour());
        endCal.set(Calendar.MINUTE, rentalContract.getRentalEndMinute());

        long durationInMillis = endCal.getTimeInMillis() - startCal.getTimeInMillis();
        long durationInHours = durationInMillis / (1000 * 60 * 60);

        long days = durationInHours / 24;
        long hours = durationInHours % 24;

        double totalValue = (days * rentalContract.getRentalPricePerDay()) + (hours * rentalContract.getExtraHourlyCharge());

        rentalContract.setTotalRentalValue(totalValue);
    }
}
