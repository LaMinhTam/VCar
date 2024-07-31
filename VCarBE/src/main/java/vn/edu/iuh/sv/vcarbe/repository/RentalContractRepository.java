package vn.edu.iuh.sv.vcarbe.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import org.bson.types.ObjectId;

import java.util.List;

public interface RentalContractRepository extends MongoRepository<RentalContract, ObjectId> {
    List<RentalContract> findByOwner(ObjectId owner, Sort sort);

    List<RentalContract> findByLessee(ObjectId lessee, Sort sort);
}
