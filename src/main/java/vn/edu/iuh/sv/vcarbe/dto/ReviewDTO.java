package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private String id;
    private String comment;
    private int rating;
    private UserDTO lessee;

    public ReviewDTO(Document document) {
        this.id = document.getObjectId("_id").toString();
        this.comment = document.getString("comment");
        this.rating = document.getInteger("rating");
        this.lessee = new UserDTO(document.getObjectId("lesseeId").toHexString());
    }
}
