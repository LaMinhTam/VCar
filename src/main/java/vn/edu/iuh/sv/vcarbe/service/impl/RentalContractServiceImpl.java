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
import org.web3j.tuples.generated.Tuple9;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalRequestRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.math.BigInteger;
import java.util.List;

@Service
public class RentalContractServiceImpl implements RentalContractService {
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationUtils notificationUtils;
    @Autowired
    private BlockchainUtils blockchainUtils;

    @Override
    public List<RentalContractDTO> getRentalContractForLessor(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalContracts = rentalContractRepository.findByLessorId(id, pageable);

        return modelMapper.map(rentalContracts.getContent(), new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public List<RentalContractDTO> getRentalContractForLessee(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalContracts = rentalContractRepository.findByLesseeId(id, pageable);

        return modelMapper.map(rentalContracts.getContent(), new TypeToken<List<RentalContractDTO>>() {
        }.getType());
    }

    @Override
    public RentalContractDTO getRentalContract(ObjectId id) throws Exception {
        RentalContract rentalContract = rentalContractRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + id));
        Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> contractDetails = blockchainUtils.getRentalContractDetails(rentalContract.getId().toHexString());
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }

    @Override
    public RentalContractDTO signRentalContract(UserPrincipal userPrincipal, SignRequest signRequest) throws Exception {
        RentalContract rentalContract = rentalContractRepository.findByLesseeIdAndId(userPrincipal.getId(), signRequest.contractId())
                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + signRequest.contractId()));
        User lesseeUser = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new AppException(404, "Lessee not found with id " + userPrincipal.getId()));
        rentalContract.sign(lesseeUser, signRequest);
        rentalContract = rentalContractRepository.save(rentalContract);
        notificationUtils.createNotification(rentalContract.getLessorId(), "Lessee has signed the contract", NotificationType.RENTAL_CONTRACT, "/rental-contracts/" + rentalContract.getId(), rentalContract.getId());
        blockchainUtils.approveRentalContract(rentalContract.getId().toHexString());
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }
}
