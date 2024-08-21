package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.Transmission;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public ResponseEntity<ApiResponse> createCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Car car) {
        if (!userPrincipal.isVerify()) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "You must verify your email, car license, citizen identification first", null));
        }
        car.setOwner(userPrincipal.getId());
        CarDTO createdCar = carService.createCar(car);
        return ResponseEntity.ok(new ApiResponse(200, "Car created successfully", createdCar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable ObjectId id, @RequestBody Car car) {
        CarDTO updatedCar = carService.updateCar(userPrincipal, id, car);
        return ResponseEntity.ok(new ApiResponse(200, "Car updated successfully", updatedCar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable ObjectId id) {
        carService.deleteCar(userPrincipal, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findCarById(@PathVariable ObjectId id) {
        CarDTO car = carService.findCarById(id);
        return ResponseEntity.ok(new ApiResponse(200, "success", car));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<ApiResponse> autocomplete(@RequestParam String query, @RequestParam Province province) {
        List<String> suggestions = carService.autocomplete(query, province);
        return ResponseEntity.ok(new ApiResponse(200, "success", suggestions));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@RequestParam(required = false) String query,
                                              @RequestParam(required = false) Province province,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(required = false) Transmission[] transmission,
                                              @RequestParam(required = false) Integer[] seats,
                                              @RequestParam(required = false) Integer minConsumption,
                                              @RequestParam(required = false) Integer maxConsumption,
                                              @RequestParam(required = false) Integer maxRate) {
        List<CarDTO> cars = carService.search(query, province, transmission, seats, minConsumption, maxConsumption, maxRate, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", cars));
    }
}
