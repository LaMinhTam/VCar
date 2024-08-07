package vn.edu.iuh.sv.vcarbe.dto;

import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

import java.util.Date;

public record RentRequestDTO
        (
                @NotNull ObjectId carId,

                // Rental details
                @NotNull Date rentalStartDate,
                @NotNull int rentalStartHour,
                @NotNull int rentalStartMinute,
                @NotNull Date rentalEndDate,
                @NotNull int rentalEndHour,
                @NotNull int rentalEndMinute,
                @NotNull String vehicleHandOverLocation
        ) {
}
