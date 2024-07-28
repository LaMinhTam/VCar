package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.*;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Field;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.UserDTO;
import vn.edu.iuh.sv.vcarbe.entity.*;

import java.util.*;

@Repository
public class CarRepositoryCustomImpl implements CarRepositoryCustom {
    @Autowired
    private MongoClient mongoClient;
    @Autowired
    private ModelMapper modelMapper;

    private MongoCollection<Document> getCarCollection() {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection("cars");
    }

    private Bson buildSearchQuery(String query, Province province) {
        Bson brandSearchQuery = Filters.regex("brand", query, "i");
        Bson modelSearchQuery = Filters.regex("model", query, "i");
        Bson combinedSearchQuery = Filters.or(brandSearchQuery, modelSearchQuery);
        Bson provinceFilter = Filters.eq("province", province);
        return Filters.and(provinceFilter, combinedSearchQuery);
    }

    private List<Bson> buildPipeline(Bson filter) {
        return Arrays.asList(
                Aggregates.match(filter),
                Aggregates.addFields(new Field<>("ownerObjectId", new Document("$toObjectId", "$owner._id"))), // Convert owner string to ObjectId
                Aggregates.lookup("users", "ownerObjectId", "_id", "ownerDetails"),
                Aggregates.unwind("$ownerDetails"),
                Aggregates.project(Projections.fields(
                        Projections.computed("id", "$_id"), // Rename _id to id
                        Projections.include("brand", "model", "year", "status", "imageUrl", "province", "location", "dailyRate", "seats", "transmission", "fuel", "fuelConsumption", "description", "features"),
                        Projections.computed("owner.id", "$ownerDetails._id"), // Rename owner._id to owner.id
                        Projections.computed("owner.email", "$ownerDetails.email"),
                        Projections.computed("owner.displayName", "$ownerDetails.displayName"),
                        Projections.computed("owner.phoneNumber", "$ownerDetails.phoneNumber")
                ))
        );
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        MongoCollection<Document> collection = getCarCollection();

        Bson finalQuery = buildSearchQuery(query, province);
        Bson projection = Projections.fields(
                Projections.include("brand", "model"),
                Projections.excludeId()
        );

        FindIterable<Document> results = collection.find(finalQuery).projection(projection);

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
    public List<CarDTO> search(String query, Province province) {
        MongoCollection<Document> collection = getCarCollection();

        Bson finalQuery = buildSearchQuery(query, province);
        List<Bson> pipeline = buildPipeline(finalQuery);

        AggregateIterable<Document> results = collection.aggregate(pipeline);

        List<CarDTO> carDTOs = new ArrayList<>();
        for (Document result : results) {
            CarDTO carDTO = modelMapper.map(result, CarDTO.class);
            Document ownerDetails = (Document) result.get("owner");
            if (ownerDetails != null) {
                UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
                carDTO.setOwner(userDTO);
            }
            carDTOs.add(carDTO);
        }

        return carDTOs;
    }

    @Override
    public CarDTO findByIdCustom(ObjectId id) {
        MongoCollection<Document> collection = getCarCollection();

        Bson idFilter = Filters.eq("_id", id);
        List<Bson> pipeline = buildPipeline(idFilter);

        AggregateIterable<Document> results = collection.aggregate(pipeline);
        Document result = results.first();
        if (result == null) {
            return null;
        }

        CarDTO carDTO = modelMapper.map(result, CarDTO.class);
        Document ownerDetails = (Document) result.get("owner");
        if (ownerDetails != null) {
            UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
            carDTO.setOwner(userDTO);
        }

        return carDTO;
    }
}
