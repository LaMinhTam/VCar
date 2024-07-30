package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "cars")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @MongoId
    private ObjectId id;
    private ObjectId owner;
    private String brand;
    private String model;
    private int year;
    private CarStatus status;
    private List<String> imageUrl;
    private Province province;
    private String location;
    private double dailyRate;
    private int seats;
    private Transmission transmission;
    private Fuel fuel;
    private double fuelConsumption;
    private String description;
    private List<Feature> features = new ArrayList<>();
}