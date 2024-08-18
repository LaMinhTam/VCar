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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarModel;
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
        return new ArrayList<>(Arrays.asList(
                Aggregates.match(filter),
                Aggregates.lookup("users", "owner", "_id", "ownerDetails"),
                Aggregates.unwind("$ownerDetails"),
                Aggregates.project(Projections.fields(
                        Projections.computed("id", "$_id"), // Rename _id to id
                        Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation", "mileageLimitPerDay", "extraMileageCharge", "extraHourlyCharge"),
                        Projections.computed("owner.id", "$ownerDetails._id"), // Rename owner._id to owner.id
                        Projections.computed("owner.email", "$ownerDetails.email"),
                        Projections.computed("owner.displayName", "$ownerDetails.displayName"),
                        Projections.computed("owner.phoneNumber", "$ownerDetails.phoneNumber")
                ))
        ));
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
    public CarModel findByIdCustom(ObjectId id) {
        MongoCollection<Document> collection = getCarCollection();

        Bson idFilter = Filters.eq("_id", id);
        List<Bson> pipeline = buildPipeline(idFilter);

        AggregateIterable<Document> results = collection.aggregate(pipeline);
        Document result = results.first();
        if (result == null) {
            return null;
        }

        CarModel carDTO = modelMapper.map(result, CarModel.class);
        Document ownerDetails = (Document) result.get("owner");
        if (ownerDetails != null) {
            UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
            carDTO.setOwner(userDTO);
        }

        return carDTO;
    }

    @Override
    public List<Car> findAllWithFilters(
            Province province, Transmission[] transmission, Integer[] seats,
            Integer minConsumption, Integer maxConsumption, Integer maxRate, Pageable pageable) {

        MongoCollection<Document> collection = getCarCollection();
        List<Bson> filters = buildFilters(province, transmission, seats, minConsumption, maxConsumption, maxRate);

        List<Bson> pipeline = buildPipelineWithPaging(filters, pageable);

        return executeQueryAndMapResults(collection, pipeline);
    }

    private List<Bson> buildFilters(
            Province province, Transmission[] transmission, Integer[] seats,
            Integer minConsumption, Integer maxConsumption, Integer maxRate) {

        List<Bson> filters = new ArrayList<>();

        addProvinceFilter(filters, province);
        addTransmissionFilter(filters, transmission);
        addSeatFilter(filters, seats);
        addConsumptionFilters(filters, minConsumption, maxConsumption);
        addMaxRateFilter(filters, maxRate);

        // Return an empty list if no filters are present
        return filters.isEmpty() ? null : filters;
    }

    private void addProvinceFilter(List<Bson> filters, Province province) {
        if (province != null) {
            filters.add(Filters.eq("province", province));
        }
    }

    private void addTransmissionFilter(List<Bson> filters, Transmission[] transmission) {
        if (transmission != null && transmission.length > 0) {
            filters.add(Filters.in("transmission", (Object[]) transmission));
        }
    }

    private void addSeatFilter(List<Bson> filters, Integer[] seats) {
        Bson seatFilter = buildSeatFilter(seats);
        if (seatFilter != null) {
            filters.add(seatFilter);
        }
    }

    private void addConsumptionFilters(List<Bson> filters, Integer minConsumption, Integer maxConsumption) {
        if (minConsumption != null) {
            filters.add(Filters.gte("fuelConsumption", minConsumption));
        }
        if (maxConsumption != null) {
            filters.add(Filters.lte("fuelConsumption", maxConsumption));
        }
    }

    private void addMaxRateFilter(List<Bson> filters, Integer maxRate) {
        if (maxRate != null) {
            filters.add(Filters.lte("dailyRate", maxRate));
        }
    }

    private List<Bson> buildPipelineWithPaging(List<Bson> filters, Pageable pageable) {
        List<Bson> pipeline = new ArrayList<>();

        if (filters != null && !filters.isEmpty()) {
            pipeline.add(Aggregates.match(Filters.and(filters)));
        }

        if (pageable != null) {
            pipeline.add(Aggregates.skip(pageable.getPageNumber() * pageable.getPageSize()));
            pipeline.add(Aggregates.limit(pageable.getPageSize()));
        }

        return pipeline;
    }

    private List<Car> executeQueryAndMapResults(MongoCollection<Document> collection, List<Bson> pipeline) {
        AggregateIterable<Document> results = collection.aggregate(pipeline);
        List<Car> cars = new ArrayList<>();
        for (Document result : results) {
            Car car = modelMapper.map(result, Car.class);
            cars.add(car);
        }
        return cars;
    }

    private Bson buildSeatFilter(Integer[] seats) {
        if (seats == null || seats.length == 0) {
            return null;
        }

        Arrays.sort(seats);

        if (isContinuousSequence(seats) && seats[seats.length - 1] >= 10) {
            return Filters.gte("seat", seats[0]);
        }

        return buildFallbackSeatFilter(seats);
    }

    private boolean isContinuousSequence(Integer[] seats) {
        // The allowed seat configurations in order
        List<Integer> allowedSeats = Arrays.asList(2, 4, 5, 7, 9, 10);

        // Ensure the input seats are sorted
        Arrays.sort(seats);

        // Check if the sequence is continuous according to the allowed seat configurations
        int lastIndex = -1;
        for (int seat : seats) {
            int currentIndex = allowedSeats.indexOf(seat);
            if (currentIndex == -1 || (lastIndex != -1 && currentIndex != lastIndex + 1)) {
                return false;
            }
            lastIndex = currentIndex;
        }
        return true;
    }


    private Bson buildFallbackSeatFilter(Integer[] seats) {
        List<Bson> seatFilters = new ArrayList<>();
        for (int seat : seats) {
            if (seat == 2 || seat == 4 || seat == 6 || seat == 8) {
                seatFilters.add(Filters.eq("seat", seat));
            } else if (seat >= 10) {
                seatFilters.add(Filters.gte("seat", 10));
            }
        }

        return seatFilters.isEmpty() ? null : Filters.or(seatFilters);
    }
}