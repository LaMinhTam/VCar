package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "rental_requests")
public class RentalRequest extends RentalDetails {
    private RentRequestStatus status;

    public RentalRequest(RentRequestDTO rentRequestDTO, Car car, ObjectId lesseeId) {
        super(car.getId(), lesseeId, car.getOwner(), rentRequestDTO.rentalStartDate(), rentRequestDTO.rentalStartHour(), rentRequestDTO.rentalStartMinute(), rentRequestDTO.rentalEndDate(), rentRequestDTO.rentalEndHour(), rentRequestDTO.rentalEndMinute(), rentRequestDTO.vehicleHandOverLocation());
        this.status = RentRequestStatus.PENDING;
    }
}
