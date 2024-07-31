package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.CarModel;
import vn.edu.iuh.sv.vcarbe.dto.RentRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
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
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RentalContractDTO createRentalContract(RentRequest rentRequest, ObjectId lesseeId) {
        // Fetch car details
        CarModel car = carRepository.findByIdCustom(rentRequest.carId());
        if (car == null) {
            throw new AppException(404, "Car not found with id " + rentRequest.carId());
        }

        User lessorUser = userRepository.findById(new ObjectId(car.getOwner().getId()))
                .orElseThrow(() -> new AppException(404, "Lessor not found with id " + car.getOwner().getId()));

        User lesseeUser = userRepository.findById(lesseeId)
                .orElseThrow(() -> new AppException(404, "Lessee not found with id " + lesseeId));

        RentalContract rentalContract = new RentalContract();
        rentalContract.setCarId(new ObjectId(car.getId()));
        rentalContract.setOwner(new ObjectId(car.getOwner().getId()));
        rentalContract.setLessee(lesseeUser.getId());
        rentalContract.setCreatedAt(new Date());

        populateUserDetails(rentalContract, lessorUser, true);
        populateUserDetails(rentalContract, lesseeUser, false);
        setOrganizationDetails(rentalContract, rentRequest);
        setRentalDetails(rentalContract, rentRequest);
        setPricingDetails(rentalContract, car);
        setCarDetails(rentalContract, car);
        calculateTotalRentalValue(rentalContract);

        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);
        return modelMapper.map(savedRentalContract, RentalContractDTO.class);
    }

    private void populateUserDetails(RentalContract rentalContract, User user, boolean isLessor) {
        if (isLessor) {
            rentalContract.setLessorIdentityNumber(user.getCitizenIdentification().getCitizenIdentificationNumber());
            rentalContract.setLessorPermanentAddress(user.getCitizenIdentification().getPermanentAddress());
            rentalContract.setLessorContactAddress(user.getCitizenIdentification().getContactAddress());
            rentalContract.setLessorPhoneNumber(user.getPhoneNumber());
        } else {
            rentalContract.setLesseeIdentityNumber(user.getCitizenIdentification().getCitizenIdentificationNumber());
            rentalContract.setLesseePassportNumber(user.getCitizenIdentification().getPassportNumber());
            rentalContract.setLesseeLicenseNumber(user.getCarLicense().getId());
            rentalContract.setLesseePermanentAddress(user.getCitizenIdentification().getPermanentAddress());
            rentalContract.setLesseeContactAddress(user.getCitizenIdentification().getContactAddress());
            rentalContract.setLesseePhoneNumber(user.getPhoneNumber());
        }
    }

    private void setOrganizationDetails(RentalContract rentalContract, RentRequest rentRequest) {
        rentalContract.setOrganizationRegistrationNumber(rentRequest.organizationRegistrationNumber());
        rentalContract.setOrganizationHeadquarters(rentRequest.organizationHeadquarters());
        rentalContract.setLegalRepresentativeName(rentRequest.legalRepresentativeName());
        rentalContract.setLegalRepresentativePosition(rentRequest.legalRepresentativePosition());
        rentalContract.setOrganizationPhoneNumber(rentRequest.organizationPhoneNumber());
    }

    private void setRentalDetails(RentalContract rentalContract, RentRequest rentRequest) {
        rentalContract.setRentalStartDate(rentRequest.rentalStartDate());
        rentalContract.setRentalStartHour(rentRequest.rentalStartHour());
        rentalContract.setRentalStartMinute(rentRequest.rentalStartMinute());
        rentalContract.setRentalEndDate(rentRequest.rentalEndDate());
        rentalContract.setRentalEndHour(rentRequest.rentalEndHour());
        rentalContract.setRentalEndMinute(rentRequest.rentalEndMinute());
        rentalContract.setVehicleHandOverLocation(rentRequest.vehicleHandOverLocation());
    }

    // Helper method to set pricing details
    private void setPricingDetails(RentalContract rentalContract, CarModel car) {
        rentalContract.setRentalPricePerDay(car.getDailyRate());
        rentalContract.setMileageLimitPerDay(car.getMileageLimitPerDay());
        rentalContract.setExtraMileageCharge(car.getExtraMileageCharge());
        rentalContract.setExtraHourlyCharge(car.getExtraHourlyCharge());
    }

    private void setCarDetails(RentalContract rentalContract, CarModel car) {
        rentalContract.setVehicleLicensePlate(car.getLicensePlate());
        rentalContract.setVehicleBrand(car.getBrand());
        rentalContract.setVehicleManufacturingYear(car.getYear());
        rentalContract.setVehicleColor(car.getColor());
        rentalContract.setVehicleRegistrationNumber(car.getRegistrationNumber());
        rentalContract.setVehicleRegistrationDate(car.getRegistrationDate());
        rentalContract.setVehicleRegistrationLocation(car.getRegistrationLocation());
        rentalContract.setVehicleOwnerName(car.getOwner().getDisplayName());
    }

    @Override
    public RentalContractDTO getRentalContract(ObjectId id) {
        RentalContract rentalContract = getRentalContractFromRepository(id);
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }

    @Override
    public List<RentalContractDTO> getRentalContractForLessor(
            ObjectId id, String sortField, boolean sortDescending, boolean isApproved, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalContracts;
        if (isApproved) {
            rentalContracts = rentalContractRepository.findByOwnerAndIsApproved(id, true, pageable);
        } else {
            rentalContracts = rentalContractRepository.findByOwner(id, pageable);
        }

        return modelMapper.map(rentalContracts.getContent(), new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public List<RentalContractDTO> getRentalContractForLessee(
            ObjectId id, String sortField, boolean sortDescending, boolean isApproved, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalContracts;
        if (isApproved) {
            rentalContracts = rentalContractRepository.findByLesseeAndIsApproved(id, true, pageable);
        } else {
            rentalContracts = rentalContractRepository.findByLessee(id, pageable);
        }

        return modelMapper.map(rentalContracts.getContent(), new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public RentalContractDTO approveRentalContract(ApprovalRequest approvalRequest) {
        RentalContract rentalContract = getRentalContractFromRepository(approvalRequest.rentalContractId());
        rentalContract.setIsApproved(true);
        rentalContract.setActionTime(new Date());
        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);
        return modelMapper.map(savedRentalContract, RentalContractDTO.class);
    }

    @Override
    public RentalContractDTO rejectRentalContract(ApprovalRequest approvalRequest) {
        RentalContract rentalContract = getRentalContractFromRepository(approvalRequest.rentalContractId());
        rentalContract.setIsApproved(false);
        rentalContract.setActionTime(new Date());
        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);
        return modelMapper.map(savedRentalContract, RentalContractDTO.class);
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
