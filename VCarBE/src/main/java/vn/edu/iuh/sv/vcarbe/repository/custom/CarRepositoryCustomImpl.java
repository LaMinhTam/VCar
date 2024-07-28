package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.entity.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class CarRepositoryCustomImpl implements CarRepositoryCustom {
    @Autowired
    private MongoClient mongoClient;

    @Override
    public List<String> autocomplete(String query, Province province) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        MongoCollection<Document> collection = database.getCollection("cars");

        // Create regex search queries for both brand and model fields
        Bson brandSearchQuery = Filters.regex("brand", query, "i");
        Bson modelSearchQuery = Filters.regex("model", query, "i");

        // Combine the queries using the $or operator
        Bson combinedSearchQuery = Filters.or(brandSearchQuery, modelSearchQuery);

        // Filter by province
        Bson provinceFilter = Filters.eq("province", province);

        // Combine the province filter with the search query
        Bson finalQuery = Filters.and(provinceFilter, combinedSearchQuery);

        // Specify the fields to project
        Bson projection = Projections.fields(
                Projections.include("brand", "model"),
                Projections.excludeId()
        );

        // Execute the search query
        FindIterable<Document> results = collection.find(finalQuery).projection(projection);

        // Collect unique suggestions from both fields and concatenate them
        Set<String> suggestions = new HashSet<>();
        for (Document result : results) {
            String brand = result.getString("brand");
            String model = result.getString("model");

            if (brand != null) {
                suggestions.add(brand);
            }
            if (model != null) {
                suggestions.add(model);
            }
            if (brand != null && model != null) {
                suggestions.add(brand + " " + model);
            }
        }
        return new ArrayList<>(suggestions);
    }

    @Override
    public List<Car> search(String query, Province province) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        MongoCollection<Document> collection = database.getCollection("cars");

        // Create regex search queries for both brand and model fields
        Bson brandSearchQuery = Filters.regex("brand", query, "i");
        Bson modelSearchQuery = Filters.regex("model", query, "i");

        // Combine the queries using the $or operator
        Bson combinedSearchQuery = Filters.or(brandSearchQuery, modelSearchQuery);

        // Filter by province
        Bson provinceFilter = Filters.eq("province", province);

        // Combine the province filter with the search query
        Bson finalQuery = Filters.and(provinceFilter, combinedSearchQuery);

        // Execute the search query
        FindIterable<Document> results = collection.find(finalQuery);

        // Convert the results to a list of Car objects
        List<Car> cars = new ArrayList<>();
        for (Document result : results) {
            Car car = new Car();
            car.setId(result.getObjectId("_id"));
            car.setOwner(result.getString("owner"));
            car.setBrand(result.getString("brand"));
            car.setModel(result.getString("model"));
            car.setYear(result.getInteger("year"));
            car.setStatus(CarStatus.valueOf(result.getString("status")));
            car.setImageUrl(result.getString("imageUrl"));
            car.setProvince(Province.valueOf(result.getString("province")));
            car.setLocation(result.getString("location"));
            car.setDailyRate(result.getDouble("dailyRate"));
            car.setSeats(result.getInteger("seats"));
            car.setTransmission(Transmission.valueOf(result.getString("transmission")));
            car.setFuel(Fuel.valueOf(result.getString("fuel")));
            car.setFuelConsumption(result.getDouble("fuelConsumption"));
            car.setDescription(result.getString("description"));
            List<String> featureStrings = result.getList("features", String.class);
            List<Feature> features = new ArrayList<>();
            if (featureStrings != null) {
                for (String featureString : featureStrings) {
                    features.add(Feature.valueOf(featureString));
                }
            }
            car.setFeatures(features);
            cars.add(car);
        }
        return cars;
    }
}
