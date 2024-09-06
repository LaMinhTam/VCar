package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.ReviewRequest;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.ReviewServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    private ReviewServiceImpl reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse> addReview(@CurrentUser UserPrincipal userPrincipal, @RequestBody @Valid ReviewRequest reviewRequest) {
        Review review = reviewService.addReview(userPrincipal, reviewRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Review added successfully", review));
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<ApiResponse> getReviewsByCar(@PathVariable ObjectId carId) {
        List<CarReviewDTO> reviews = reviewService.getReviewsByCarId(carId);
        return ResponseEntity.ok(new ApiResponse(200, "Reviews retrieved successfully", reviews));
    }

    @GetMapping("/lessee/{lesseeId}")
    public ResponseEntity<ApiResponse> getReviewsByLessee(@PathVariable ObjectId lesseeId) {
        List<LesseeReviewDTO> reviews = reviewService.getReviewsByLesseeId(lesseeId);
        return ResponseEntity.ok(new ApiResponse(200, "Reviews retrieved successfully", reviews));
    }
}
