package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.entity.Invoice;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, ObjectId> {
    Optional<Invoice> findByTxnRef(String invoiceId);
    Page<Invoice> findByLesseeId(ObjectId lesseeId, Pageable pageable);
    Invoice findByInvoiceIdAndLesseeId(ObjectId invoiceId, ObjectId lesseeId);
}
