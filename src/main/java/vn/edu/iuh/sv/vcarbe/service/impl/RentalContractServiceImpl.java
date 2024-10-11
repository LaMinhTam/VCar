package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.util.List;

@Service
public class RentalContractServiceImpl implements RentalContractService {
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationUtils notificationUtils;
    @Autowired
    private BlockchainUtils blockchainUtils;

    @Override
    public Page<RentalContractDTO> getRentalContractForLessor(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalPage = rentalContractRepository.findByLessorId(id, pageable);
        List<RentalContractDTO> rentalContracts = rentalPage.getContent().stream()
                .map(contract -> modelMapper.map(contract, RentalContractDTO.class))
                .toList();
        return new PageImpl<>(rentalContracts, pageable, rentalPage.getTotalElements());
    }


    @Override
    public Page<RentalContractDTO> getRentalContractForLessee(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalContract> rentalPage = rentalContractRepository.findByLesseeId(id, pageable);
        List<RentalContractDTO> rentalContracts = rentalPage.getContent().stream()
                .map(contract -> modelMapper.map(contract, RentalContractDTO.class))
                .toList();
        return new PageImpl<>(rentalContracts, pageable, rentalPage.getTotalElements());
    }


    @Override
    public RentalContractDTO getRentalContract(ObjectId id) throws Exception {
//        RentalContract rentalContract = rentalContractRepository.findById(id)
//                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + id));
//        Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> contractDetails = blockchainUtils.getRentalContractDetails(rentalContract.getId().toHexString());
//        return modelMapper.map(rentalContract, RentalContractDTO.class);
        RentalContract rentalContract = rentalContractRepository.findById(id).orElseThrow(() -> new AppException(404, MessageKeys.CONTRACT_NOT_FOUND.name()));
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }
}
