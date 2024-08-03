package vn.edu.iuh.sv.vcarbe.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import org.bson.types.ObjectId;

import java.util.Optional;

public interface RentalContractRepository extends MongoRepository<RentalContract, ObjectId> {

    Page<RentalContract> findByOwner(ObjectId owner, Pageable pageable);

    Page<RentalContract> findByOwnerAndIsApproved(ObjectId owner, boolean isApproved, Pageable pageable);

    Page<RentalContract> findByLessee(ObjectId lessee, Pageable pageable);

    Page<RentalContract> findByLesseeAndIsApproved(ObjectId lessee, boolean isApproved, Pageable pageable);

    Optional<RentalContract> findByLesseeAndId(ObjectId lessee, ObjectId id);
}
