package vn.edu.iuh.sv.vcarbe.dto;

import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

import java.util.Date;

public record RentRequest
        (
                @NotNull ObjectId carId,

                // For individual lessee
                String lesseeIdentityNumber,
                String lesseePassportNumber,
                String lesseeLicenseNumber,
                String lesseePermanentAddress,
                String lesseeContactAddress,
                String lesseePhoneNumber,

                // For organizational lessee
                String organizationRegistrationNumber,
                String organizationHeadquarters,
                String legalRepresentativeName,
                String legalRepresentativePosition,
                String organizationPhoneNumber,

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
