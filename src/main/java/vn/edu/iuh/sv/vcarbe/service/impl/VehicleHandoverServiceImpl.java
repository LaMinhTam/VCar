package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.DigitalSignature;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.VehicleHandoverRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.VehicleHandoverService;

@Service
public class VehicleHandoverServiceImpl implements VehicleHandoverService {
    @Autowired
    private VehicleHandoverRepository vehicleHandoverRepository;
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Mono<VehicleHandoverDocumentDTO> createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request) {
        return rentalContractRepository.findByLessorIdAndId(userPrincipal.getId(), request.getRentalContractId())
                .switchIfEmpty(Mono.error(new AppException(404, "Rental contract not found with id " + request.getRentalContractId())))
                .flatMap(rentalContract -> {
                    VehicleHandoverDocument document = new VehicleHandoverDocument();
                    document.setLesseeId(rentalContract.getLesseeId());
                    document.setLessorId(rentalContract.getLessorId());
                    document.setRentalContractId(request.getRentalContractId());
                    document.setHandoverDate(request.getHandoverDate());
                    document.setHandoverHour(request.getHandoverHour());
                    document.setInitialConditionNormal(request.isInitialConditionNormal());
                    document.setVehicleCondition(request.getVehicleCondition());
                    document.setDamages(request.getDamages());
                    document.setOdometerReading(request.getOdometerReading());
                    document.setFuelLevel(request.getFuelLevel());
                    document.setPersonalItems(request.getPersonalItems());
                    document.setCollateral(request.getCollateral());
                    document.setLessorSignature(request.getDigitalSignature().signature_url());
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> approveByLessee(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        return vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, "Vehicle handover document not found with id " + id)))
                .flatMap(document -> {
                    document.setLesseeApproved(true);
                    document.setLesseeSignature(document.getLesseeSignature());
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> approveByLessor(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        return vehicleHandoverRepository.findByIdAndLessorId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, "Vehicle handover document not found with id " + id)))
                .flatMap(document -> {
                    document.setLessorApproved(true);
                    document.setReturnLessorSignature(digitalSignature.signature_url());
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal) {
        return vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, "Vehicle handover document not found with id " + id)))
                .flatMap(document -> {
                    document.setReturnDate(request.getReturnDate());
                    document.setReturnHour(request.getReturnHour());
                    document.setConditionMatchesInitial(request.isConditionMatchesInitial());
                    document.setReturnVehicleCondition(request.getVehicleCondition());
                    document.setReturnDamages(request.getDamages());
                    document.setReturnOdometerReading(request.getOdometerReading());
                    document.setReturnFuelLevel(request.getFuelLevel());
                    document.setReturnPersonalItems(request.getPersonalItems());
                    document.setReturnLesseeSignature(request.getDigitalSignature().signature_url());
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> getVehicleHandoverByRentalContractId(ObjectId rentalContractId) {
        return vehicleHandoverRepository.findByRentalContractId(rentalContractId)
                .switchIfEmpty(Mono.error(new AppException(404, "Vehicle handover document not found for rental contract id " + rentalContractId)))
                .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class));
    }

}
