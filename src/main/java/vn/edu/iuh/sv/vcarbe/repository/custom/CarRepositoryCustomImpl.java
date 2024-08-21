package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.*;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.*;
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

    private MongoCollection<Document> getReviewCollection() {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection("reviews");
    }

    private MongoCollection<Document> getUserCollection() {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection("users");
    }

    private Bson buildSearchQuery(SearchCriteria criteria) {
        Bson nameSearchQuery = criteria.getQuery() != null ? Filters.regex("name", criteria.getQuery(), "i") : Filters.exists("name");
        Bson provinceFilter = criteria.getProvince() != null ? Filters.eq("province", criteria.getProvince()) : Filters.exists("province");
        Bson transmissionFilter = criteria.getTransmission() != null && criteria.getTransmission().length > 0 ? Filters.in("transmission", (Object[]) criteria.getTransmission()) : Filters.exists("transmission");
        Bson seatsFilter = buildSeatsFilter(criteria.getSeats());
        Bson minConsumptionFilter = criteria.getMinConsumption() != null ? Filters.gte("fuelConsumption", criteria.getMinConsumption()) : Filters.exists("fuelConsumption");
        Bson maxConsumptionFilter = criteria.getMaxConsumption() != null ? Filters.lte("fuelConsumption", criteria.getMaxConsumption()) : Filters.exists("fuelConsumption");
        Bson maxRateFilter = criteria.getMaxRate() != null ? Filters.lte("dailyRate", criteria.getMaxRate()) : Filters.exists("dailyRate");

        return Filters.and(provinceFilter, nameSearchQuery, transmissionFilter, seatsFilter, minConsumptionFilter, maxConsumptionFilter, maxRateFilter);
    }

    private Bson buildSeatsFilter(Integer[] seats) {
        if (seats == null || seats.length == 0) {
            return Filters.exists("seat");
        }

        Arrays.sort(seats);
        List<Bson> filters = new ArrayList<>();
        boolean hasContinuousRange = isContinuousSequence(seats);

        if (hasContinuousRange) {
            filters.add(Filters.gte("seat", seats[0]));
        } else {
            List<Bson> orFilters = new ArrayList<>();
            for (int seat : seats) {
                if (seat >= 10) {
                    orFilters.add(Filters.gte("seat", seat));
                } else {
                    orFilters.add(Filters.eq("seat", seat));
                }
            }
            filters.add(Filters.or(orFilters));
        }

        return Filters.and(filters);
    }

    private boolean isContinuousSequence(Integer[] seats) {
        List<Integer> allowedSeats = Arrays.asList(2, 4, 5, 7, 9, 10);
        Arrays.sort(seats);

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

    private List<Bson> buildPipeline(Bson filter, Pageable pageable) {
        List<Bson> pipeline = new ArrayList<>();
        pipeline.add(Aggregates.match(filter));
        pipeline.add(Aggregates.lookup("users", "owner", "_id", "ownerDetails"));
        pipeline.add(Aggregates.unwind("$ownerDetails"));
        pipeline.add(Aggregates.project(Projections.fields(
                Projections.computed("id", "$_id"),
                Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation", "mileageLimitPerDay", "extraMileageCharge", "extraHourlyCharge"),
                Projections.computed("owner.id", "$ownerDetails._id"),
                Projections.computed("owner.email", "$ownerDetails.email"),
                Projections.computed("owner.displayName", "$ownerDetails.displayName"),
                Projections.computed("owner.phoneNumber", "$ownerDetails.phoneNumber")
        )));

        if (pageable != null) {
            pipeline.add(Aggregates.skip((int) pageable.getOffset()));
            pipeline.add(Aggregates.limit(pageable.getPageSize()));
        }

        return pipeline;
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        MongoCollection<Document> collection = getCarCollection();

        Bson finalQuery = buildSearchQuery(null);
        Bson projection = Projections.fields(
                Projections.include("name"),
                Projections.excludeId()
        );

        FindIterable<Document> results = collection.find(finalQuery).projection(projection).limit(5);

        Set<String> suggestions = new HashSet<>();
        for (Document result : results) {
            String name = result.getString("name");

            if (name != null) {
                suggestions.add(name);
            }
        }
        return new ArrayList<>(suggestions);
    }

    @Override
    public CarModel findByIdCustom(ObjectId id) {
        MongoCollection<Document> carCollection = getCarCollection();
        MongoCollection<Document> reviewCollection = getReviewCollection();
        MongoCollection<Document> userCollection = getUserCollection();

        Bson idFilter = Filters.eq("_id", id);
        List<Bson> pipeline = buildPipeline(idFilter, null);
        AggregateIterable<Document> carResults = carCollection.aggregate(pipeline);
        Document carResult = carResults.first();

        if (carResult == null) {
            return null;
        }

        CarModel carModel = modelMapper.map(carResult, CarModel.class);
        Document ownerDetails = (Document) carResult.get("owner");
        if (ownerDetails != null) {
            UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
            carModel.setOwner(userDTO);
        }

        Bson reviewFilter = Filters.eq("carId", id);
        reviewFilter = Filters.and(reviewFilter, Filters.eq("reviewType", "LESSEE_REVIEW"));
        FindIterable<Document> reviewResults = reviewCollection.find(reviewFilter);

        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        Set<ObjectId> lesseeIds = new HashSet<>();
        for (Document review : reviewResults) {
            ReviewDTO reviewDTO = new ReviewDTO(review);
            ObjectId lesseeId = review.getObjectId("lesseeId");
            if (lesseeId != null) {
                lesseeIds.add(lesseeId);
            }
            reviewDTOs.add(reviewDTO);
        }

        Bson userFilter = Filters.in("_id", lesseeIds);
        FindIterable<Document> userResults = userCollection.find(userFilter);

        Map<String, UserDTO> userMap = new HashMap<>();
        for (Document userDocument : userResults) {
            UserDTO userDTO = new UserDTO(userDocument);
            userMap.put(userDocument.getObjectId("_id").toHexString(), userDTO);
        }

        for (ReviewDTO reviewDTO : reviewDTOs) {
            String lesseeId = reviewDTO.getLessee().getId();
            if (lesseeId != null) {
                UserDTO lesseeDTO = userMap.get(lesseeId);
                reviewDTO.setLessee(lesseeDTO);
            }
        }

        carModel.setReviews(reviewDTOs);
        return carModel;
    }

    @Override
    public List<CarDTO> search(SearchCriteria criteria, Pageable pageable) {
        MongoCollection<Document> collection = getCarCollection();

        Bson finalQuery = buildSearchQuery(criteria);
        List<Bson> pipeline = buildPipeline(finalQuery, pageable);

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
}