package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import vn.edu.iuh.sv.vcarbe.entity.RentalStatus;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentalContractDTO {
    private String id;
    private String owner;
    private String lessee;
    private Date createdAt;

    // Car lessee (Party A)
    private String renterIdentityNumber;
    private String renterIssuedDate;
    private String renterIssuedLocation;
    private String renterPermanentAddress;
    private String renterContactAddress;
    private String renterPhoneNumber;

    // Car lessee (Party B)
    private String lesseeIdentityNumber;
    private String lesseePassportNumber;
    private String lesseeLicenseNumber;
    private String lesseePermanentAddress;
    private String lesseeContactAddress;
    private String lesseePhoneNumber;

    // For organizations
    private String organizationRegistrationNumber;
    private String organizationHeadquarters;
    private String legalRepresentativeName;
    private String legalRepresentativePosition;
    private String organizationPhoneNumber;

    // Car rental information
    private String carId;
    private String vehicleLicensePlate;
    private String vehicleBrand;
    private int vehicleManufacturingYear;
    private String vehicleColor;
    private String vehicleRegistrationNumber;
    private String vehicleRegistrationDate;
    private String vehicleRegistrationLocation;
    private String vehicleOwnerName;

    // Car rental terms
    private String additionalTerms;
    private double rentalPricePerDay;
    private int mileageLimitPerDay;
    private double extraMileageCharge;

    private Date rentalStartDate;

    private Date rentalEndDate;

    private double extraHourlyCharge;
    private double totalRentalValue;
    private String vehicleHandOverLocation;
    private Boolean isApproved;
    private Date actionTime;

    private ObjectId rentalRequestId;
    private RentalStatus rentalStatus;
}