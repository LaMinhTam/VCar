package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;

import java.util.Optional;

public interface VehicleHandoverRepository extends MongoRepository<VehicleHandoverDocument, ObjectId> {
    Optional<VehicleHandoverDocument> findByRentalContractId(ObjectId rentalContractId);
}
