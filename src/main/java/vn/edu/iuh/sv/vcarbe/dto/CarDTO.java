package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarDTO {
    private String id;
    private UserDTO owner;
    private String name;
    private CarStatus status;
    private List<String> imageUrl;
    private Province province;
    private String location;
    private double dailyRate;
    private int seat;
    private Transmission transmission;
    private Fuel fuel;
    private double fuelConsumption;
    private String description;
    private List<Feature> features;
    private String color;
    private String licensePlate;
    private String registrationNumber;
    private String registrationDate;
    private String registrationLocation;
    private double averageRating;
    private String brand;
    private int manufacturingYear;

    private int mileageLimitPerDay;
    private double extraMileageCharge;
    private double extraHourlyCharge;
    private double washingPrice;
    private double deodorisePrice;
}
