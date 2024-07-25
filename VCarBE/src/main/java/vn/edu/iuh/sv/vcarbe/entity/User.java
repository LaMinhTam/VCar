package vn.edu.iuh.sv.vcarbe.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @MongoId
    private ObjectId id;
    @Email
    private String email;
    private String imageUrl;
    private String displayName;
    private String phoneNumber;
    @NotNull
    private Boolean emailVerified = false;
    @JsonIgnore
    private String password;
    @NotNull
    private AuthProvider provider;
    private String providerId;
}
