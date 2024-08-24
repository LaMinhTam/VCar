package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.*;
import com.mongodb.client.model.*;
import org.bson.BsonDocument;
import org.bson.BsonString;
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

    private MongoCollection<Document> getCollection(String collectionName) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection(collectionName);
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
        pipeline.add(Aggregates.lookup("reviews", "_id", "carId", "reviews"));
        pipeline.add(Aggregates.unwind("$reviews", new UnwindOptions().preserveNullAndEmptyArrays(true)));

        pipeline.add(Aggregates.group(
                "$_id",
                Accumulators.avg("averageRating", "$reviews.rating"),
                Accumulators.first("name", "$name"),
                Accumulators.first("status", "$status"),
                Accumulators.first("imageUrl", "$imageUrl"),
                Accumulators.first("province", "$province"),
                Accumulators.first("location", "$location"),
                Accumulators.first("dailyRate", "$dailyRate"),
                Accumulators.first("seat", "$seat"),
                Accumulators.first("transmission", "$transmission"),
                Accumulators.first("fuel", "$fuel"),
                Accumulators.first("fuelConsumption", "$fuelConsumption"),
                Accumulators.first("description", "$description"),
                Accumulators.first("features", "$features"),
                Accumulators.first("color", "$color"),
                Accumulators.first("licensePlate", "$licensePlate"),
                Accumulators.first("registrationNumber", "$registrationNumber"),
                Accumulators.first("registrationDate", "$registrationDate"),
                Accumulators.first("registrationLocation", "$registrationLocation"),
                Accumulators.first("mileageLimitPerDay", "$mileageLimitPerDay"),
                Accumulators.first("extraMileageCharge", "$extraMileageCharge"),
                Accumulators.first("extraHourlyCharge", "$extraHourlyCharge"),
                Accumulators.first("ownerId", "$ownerDetails._id"),
                Accumulators.first("ownerEmail", "$ownerDetails.email"),
                Accumulators.first("ownerDisplayName", "$ownerDetails.displayName"),
                Accumulators.first("ownerPhoneNumber", "$ownerDetails.phoneNumber")
        ));

        pipeline.add(Aggregates.project(Projections.fields(
                Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation", "mileageLimitPerDay", "extraMileageCharge", "extraHourlyCharge"),
                Projections.computed("id", "$_id"),
                Projections.computed("owner.id", "$ownerId"),
                Projections.computed("owner.email", "$ownerEmail"),
                Projections.computed("owner.displayName", "$ownerDisplayName"),
                Projections.computed("owner.phoneNumber", "$ownerPhoneNumber"),
                Projections.computed("averageRating", "$averageRating")
        )));

        if (pageable != null) {
            pipeline.add(Aggregates.skip((int) pageable.getOffset()));
            pipeline.add(Aggregates.limit(pageable.getPageSize()));
        }

        return pipeline;
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        MongoCollection<Document> collection = getCollection("cars");

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
    public CarDetailDTO findByIdCustom(ObjectId id) {
        MongoCollection<Document> carCollection = getCollection("cars");
        MongoCollection<Document> reviewCollection = getCollection("reviews");

        Bson idFilter = Filters.eq("_id", id);
        List<Bson> pipeline = buildPipeline(idFilter, null);
        AggregateIterable<Document> carResults = carCollection.aggregate(pipeline);
        Document carResult = carResults.first();

        if (carResult == null) {
            return null;
        }

        CarModel carModel = mapCarResultToModel(carResult);
        List<ReviewDTO> reviewDTOs = getReviewsForCar(id, reviewCollection);
        List<CarDTO> relatedCars = getRelatedCars(id, carCollection, carResult);

        return new CarDetailDTO(carModel, reviewDTOs, relatedCars);
    }

    private CarModel mapCarResultToModel(Document carResult) {
        CarModel carModel = modelMapper.map(carResult, CarModel.class);
        Document ownerDetails = (Document) carResult.get("owner");
        if (ownerDetails != null) {
            UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
            carModel.setOwner(userDTO);
        }
        return carModel;
    }

    private List<ReviewDTO> getReviewsForCar(ObjectId carId, MongoCollection<Document> reviewCollection) {
        Bson reviewFilter = Filters.and(Filters.eq("carId", carId), Filters.eq("reviewType", "LESSEE_REVIEW"));
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

        if (!lesseeIds.isEmpty()) {
            populateLesseeDetails(lesseeIds, reviewDTOs);
        }

        return reviewDTOs;
    }

    private void populateLesseeDetails(Set<ObjectId> lesseeIds, List<ReviewDTO> reviewDTOs) {
        MongoCollection<Document> userCollection = getCollection("users");
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
    }

    private List<CarDTO> getRelatedCars(ObjectId id, MongoCollection<Document> carCollection, Document carResult) {
        Bson relatedCarsFilter = Filters.and(
                Filters.ne("_id", id),
                Filters.eq("province", carResult.getString("province")),
                Filters.eq("transmission", carResult.getString("transmission"))
        );

        List<Bson> relatedCarsPipeline = Arrays.asList(
                Aggregates.match(relatedCarsFilter),
                Aggregates.project(Projections.fields(
                        Projections.computed("id", "$_id"),
                        Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation")
                )),
                Aggregates.limit(5)
        );

        AggregateIterable<Document> relatedCarsResults = carCollection.aggregate(relatedCarsPipeline);

        List<CarDTO> relatedCars = new ArrayList<>();
        for (Document relatedCar : relatedCarsResults) {
            CarDTO relatedCarDTO = modelMapper.map(relatedCar, CarDTO.class);
            relatedCars.add(relatedCarDTO);
        }

        return relatedCars;
    }


    @Override
    public List<CarDTO> search(SearchCriteria criteria, Pageable pageable) {
        MongoCollection<Document> collection = getCollection("cars");

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