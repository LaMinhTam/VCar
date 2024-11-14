package vn.edu.iuh.sv.vcarbe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String otp;
    @NotBlank
    private String newPassword;
}