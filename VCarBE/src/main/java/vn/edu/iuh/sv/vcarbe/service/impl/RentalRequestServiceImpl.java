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
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalRequestRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;

import java.util.Date;
import java.util.List;

@Service
public class RentalRequestServiceImpl implements RentalRequestService {
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RentalRequestRepository rentalRequestRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RentalRequestDTO createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId) {
        Car car = carRepository.findById(rentRequestDTO.carId()).orElseThrow(() -> new AppException(404, "Car not found with id " + rentRequestDTO.carId()));
        RentalRequest request = new RentalRequest(rentRequestDTO, car, lesseeId);

        RentalRequest savedRequest = rentalRequestRepository.save(request);

        return modelMapper.map(savedRequest, RentalRequestDTO.class);
    }

    @Override
    public RentalContractDTO approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) {
        RentalRequest rentalRequest = rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, "Rental request not found with id " + approvalRequest.requestId()));
        rentalRequest.setStatus(RentRequestStatus.APPROVED);
        rentalRequest.setUpdatedAt(new Date());
        rentalRequestRepository.save(rentalRequest);

        Car car = carRepository.findById(rentalRequest.getCarId()).orElseThrow(() -> new AppException(404, "Car not found with id " + rentalRequest.getCarId()));
        User lessorUser = userRepository.findById(rentalRequest.getLessorId()).orElseThrow(() -> new AppException(404, "Lessor not found with id " + rentalRequest.getLessorId()));
        RentalContract rentalContract = new RentalContract(rentalRequest, lessorUser, car);
        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);
        return modelMapper.map(savedRentalContract, RentalContractDTO.class);
    }

    @Override
    public RentalRequest rejectRentalContract(ApprovalRequest approvalRequest) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(approvalRequest.requestId())
                .orElseThrow(() -> new AppException(404, "Rental request not found with id " + approvalRequest.requestId()));
        rentalRequest.setStatus(RentRequestStatus.REJECTED);
        rentalRequestRepository.save(rentalRequest);
        return rentalRequest;
    }

    @Override
    public List<RentalRequestDTO> getRentalRequestForLessor(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<RentalRequest> rentalRequests = rentalRequestRepository.findByLessorIdAndStatus(id, status, pageable);
        return modelMapper.map(rentalRequests.getContent(), new TypeToken<List<RentalRequestDTO>>() {
        }.getType());
    }

    @Override
    public List<RentalRequestDTO> getRentalRequestForLessee(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<RentalRequest> rentalRequests = rentalRequestRepository.findByLesseeIdAndStatus(id, status, pageable);
        return modelMapper.map(rentalRequests.getContent(), new TypeToken<List<RentalRequestDTO>>() {
        }.getType());
    }
}
