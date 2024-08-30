package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {
    @MongoId
    private ObjectId invoiceId;
    private ObjectId contractId;
    private ObjectId lessorId;
    private ObjectId lesseeId;
    private String txnRef;
    private Long amount;
    private PaymentStatus paymentStatus;
    private Date createdAt = new Date();
    private String content;
}
