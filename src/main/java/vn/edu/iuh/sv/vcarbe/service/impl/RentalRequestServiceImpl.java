package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.StaticGasProvider;
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
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

@Service
public class RentalRequestServiceImpl implements RentalRequestService {
    private final RentalContractRepository rentalContractRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ModelMapper modelMapper;
    private final NotificationUtils notificationUtils;
    private final BlockchainUtils blockchainUtils;

    @Autowired
    public RentalRequestServiceImpl(RentalContractRepository rentalContractRepository, CarRepository carRepository, UserRepository userRepository, RentalRequestRepository rentalRequestRepository, ModelMapper modelMapper, NotificationUtils notificationUtils, BlockchainUtils blockchainUtils) {
        this.rentalContractRepository = rentalContractRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.modelMapper = modelMapper;
        this.notificationUtils = notificationUtils;
        this.blockchainUtils = blockchainUtils;
    }

    @Override
    public RentalRequestDTO createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId) {
        Car car = carRepository.findById(rentRequestDTO.carId()).orElseThrow(() -> new AppException(404, "Car not found with id " + rentRequestDTO.carId()));
        RentalRequest request = new RentalRequest(rentRequestDTO, car, lesseeId);

        RentalRequest savedRequest = rentalRequestRepository.save(request);
        notificationUtils.createNotification(savedRequest.getLessorId(), "New rental request", NotificationType.RENTAL_REQUEST, "/rental-requests/" + savedRequest.getId(), savedRequest.getId());
        return modelMapper.map(savedRequest, RentalRequestDTO.class);
    }

    @Override
    public RentalContractDTO approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) throws Exception {
        RentalRequest rentalRequest = rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, "Rental request not found with id " + approvalRequest.requestId()));
        rentalRequest.setStatus(RentRequestStatus.APPROVED);
        rentalRequest.setUpdatedAt(new Date());
        rentalRequestRepository.save(rentalRequest);

        Car car = carRepository.findById(rentalRequest.getCarId()).orElseThrow(() -> new AppException(404, "Car not found with id " + rentalRequest.getCarId()));
        User lessorUser = userRepository.findById(rentalRequest.getLessorId()).orElseThrow(() -> new AppException(404, "Lessor not found with id " + rentalRequest.getLessorId()));
        RentalContract rentalContract = new RentalContract(rentalRequest, lessorUser, car, approvalRequest.additionalTerms());
        rentalContract = rentalContractRepository.save(rentalContract);
        notificationUtils.createNotification(rentalContract.getLesseeId(), "Rental contract signed", NotificationType.RENTAL_CONTRACT, "/rental-contracts/" + rentalContract.getId(), rentalContract.getId());

//        blockchainUtils.createRentalContract(rentalContract);
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }

    @Override
    public RentalRequest rejectRentalContract(ApprovalRequest approvalRequest) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(approvalRequest.requestId())
                .orElseThrow(() -> new AppException(404, "Rental request not found with id " + approvalRequest.requestId()));
        rentalRequest.setStatus(RentRequestStatus.REJECTED);
        rentalRequestRepository.save(rentalRequest);
        notificationUtils.createNotification(rentalRequest.getLesseeId(), "Rental request rejected", NotificationType.RENTAL_REQUEST, "/rental-requests/" + rentalRequest.getId(), rentalRequest.getId());
        return rentalRequest;
    }

    @Override
    public List<RentalRequestDTO> getRentalRequestForLessor(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalRequest> rentalRequests;
        if (status != null) {
            rentalRequests = rentalRequestRepository.findByLessorIdAndStatus(id, status, pageable);
        } else {
            rentalRequests = rentalRequestRepository.findByLessorId(id, pageable);
        }

        return modelMapper.map(rentalRequests.getContent(), new TypeToken<List<RentalRequestDTO>>() {
        }.getType());
    }

    @Override
    public List<RentalRequestDTO> getRentalRequestForLessee(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalRequest> rentalRequests;
        if (status != null) {
            rentalRequests = rentalRequestRepository.findByLesseeIdAndStatus(id, status, pageable);
        } else {
            rentalRequests = rentalRequestRepository.findByLesseeId(id, pageable);
        }

        return modelMapper.map(rentalRequests.getContent(), new TypeToken<List<RentalRequestDTO>>() {
        }.getType());
    }

    @Override
    public RentalRequestDTO getRentalRequest(ObjectId id) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Rental request not found with id " + id));
        return modelMapper.map(rentalRequest, RentalRequestDTO.class);
    }
}
