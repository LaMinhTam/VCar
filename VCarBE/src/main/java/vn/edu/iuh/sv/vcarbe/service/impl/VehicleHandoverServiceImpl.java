package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
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
    public VehicleHandoverDocumentDTO createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request) {
        RentalContract rentalContract = rentalContractRepository.findById(request.getRentalContractId())
                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + request.getRentalContractId()));
        if (!rentalContract.getOwner().equals(userPrincipal.getId())) {
            throw new AppException(403, "You are not authorized to create vehicle handover document for this contract");
        }
        VehicleHandoverDocument document = new VehicleHandoverDocument();
        document.setLesseeId(rentalContract.getLessee());
        document.setLessorId(rentalContract.getOwner());
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
        VehicleHandoverDocument savedHandover = vehicleHandoverRepository.save(document);
        return modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO approveByLessee(ObjectId id, UserPrincipal userPrincipal) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Vehicle handover document not found with id " + id));
        if (!document.getLesseeId().equals(userPrincipal.getId())) {
            throw new AppException(403, "You are not authorized to approve this document");
        }
        document.setLesseeApproved(true);
        VehicleHandoverDocument savedHandover = vehicleHandoverRepository.save(document);
        return modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO approveByLessor(ObjectId id, UserPrincipal userPrincipal) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Vehicle handover document not found with id " + id));
        if (!document.getLessorId().equals(userPrincipal.getId())) {
            throw new AppException(403, "You are not authorized to approve this document");
        }
        document.setLessorApproved(true);
        VehicleHandoverDocument savedHandover = vehicleHandoverRepository.save(document);
        return modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Vehicle handover document not found with id " + id));
        if (!document.getLesseeId().equals(userPrincipal.getId())) {
            throw new AppException(403, "You are not authorized to update this document");
        }
        document.setReturnDate(request.getReturnDate());
        document.setReturnHour(request.getReturnHour());
        document.setConditionMatchesInitial(request.isConditionMatchesInitial());
        document.setReturnVehicleCondition(request.getVehicleCondition());
        document.setReturnDamages(request.getDamages());
        document.setReturnOdometerReading(request.getOdometerReading());
        document.setReturnFuelLevel(request.getFuelLevel());
        document.setReturnPersonalItems(request.getPersonalItems());
        document.setReturnedItems(request.getReturnedItems());
        VehicleHandoverDocument savedHandover = vehicleHandoverRepository.save(document);
        return modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO getVehicleHandoverByRentalContractId(ObjectId rentalContractId) {
        VehicleHandoverDocument vehicleHandoverDocument = vehicleHandoverRepository.findByRentalContractId(rentalContractId)
                .orElseThrow(() -> new AppException(404, "Vehicle handover document not found for rental contract id " + rentalContractId));
        return modelMapper.map(vehicleHandoverDocument, VehicleHandoverDocumentDTO.class);
    }

}
