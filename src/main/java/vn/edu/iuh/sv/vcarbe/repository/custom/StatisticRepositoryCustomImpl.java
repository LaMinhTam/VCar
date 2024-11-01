package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import com.mongodb.client.MongoClient;

@Repository
public class StatisticRepositoryCustomImpl implements StatisticRepositoryCustom {
    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getRentalContractCollection(String collectionName) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection(collectionName);
    }

    @Override
    public List<Document> getDailyRentalContractStatistics(Date startDate, Date endDate, String rentalStatus, ObjectId lessor, ObjectId lessee) {
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));
        if (rentalStatus != null) {
            matchCriteria.append("rentalStatus", rentalStatus);
        }
        if (lessor != null) {
            matchCriteria.append("lessorId", lessor);
        }
        if (lessee != null) {
            matchCriteria.append("lesseeId", lessee);
        }
        boolean calculateIncome = (lessor == null && lessee == null);

        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("dayLabel", new Document("$dateToString",
                        new Document("format", "%Y-%m-%d").append("date", "$createdAt")))
                        .append("status", "$rentalStatus"))
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                        .append("income", new Document("$sum", calculateIncome
                                ? new Document("$multiply", Arrays.asList("$totalRentalValue", 0.3))
                                : 0))
                ),
                new Document("$project", new Document("dayLabel", "$_id.dayLabel")
                        .append("status", "$_id.status")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("income", calculateIncome ? "$income" : null)  // Show income only if no lessor or lessee
                        .append("_id", 0))
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getDailyInvoiceStatistics(Date startDate, Date endDate, String type) {
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));

        if (type != null) {
            matchCriteria.append("type", type);
        }
        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("dayLabel", new Document("$dateToString",
                        new Document("format", "%Y-%m-%d").append("date", "$createdAt")))
                        .append("type", "$type"))
                        .append("totalInvoices", new Document("$sum", 1))
                        .append("totalAmount", new Document("$sum", "$amount"))
                ),
                new Document("$project", new Document("dayLabel", "$_id.dayLabel")
                        .append("type", "$_id.type")
                        .append("totalInvoices", 1)
                        .append("totalAmount", 1)
                        .append("_id", 0)),
                new Document("$sort", new Document("dayLabel", 1))
        );


        return getRentalContractCollection("invoice").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> countCarsByProvince() {
        List<Document> pipeline = Arrays.asList(
                new Document("$group", new Document("_id", "$province")
                        .append("carCount", new Document("$sum", 1))
                ),
                new Document("$project", new Document("province", "$_id")
                        .append("carCount", 1)
                        .append("_id", 0))
        );

        return getRentalContractCollection("cars").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getContractStatisticsByLessorOrLessee(Date startDate, Date endDate, boolean filterByLessor, String sortBy, String sortOrder) {
        String userIdField = filterByLessor ? "lessorId" : "lesseeId";
        int sortDirection = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
        List<Document> pipeline = Arrays.asList(
                new Document("$match", new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate))),
                new Document("$group", new Document("_id", "$" + userIdField)
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                ),
                new Document("$lookup", new Document("from", "users")
                        .append("localField", "_id")
                        .append("foreignField", "_id")
                        .append("as", "userInfo")),
                new Document("$unwind", new Document("path", "$userInfo").append("preserveNullAndEmptyArrays", true)),
                new Document("$project", new Document("displayName", "$userInfo.displayName")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("_id", 0)
                ),
                new Document("$sort", new Document(sortBy, sortDirection))
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getCarStatistics(Date startDate, Date endDate, ObjectId ownerId, String sortBy, String sortOrder) {
        int sortDirection = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));
        if (ownerId != null) {
            matchCriteria.append("ownerId", ownerId);
        }

        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("carId", "$carId")
                        .append("carName", "$vehicleName")) // Include car name
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                ),
                new Document("$project", new Document("carId", "$_id.carId")
                        .append("carName", "$_id.carName")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("_id", 0)
                ),
                new Document("$sort", new Document(sortBy, sortDirection)) // Sort dynamically
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

}
