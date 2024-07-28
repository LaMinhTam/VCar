package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public ResponseEntity<Car> createCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Car car) {
        car.setOwner(userPrincipal.getId().toHexString());
        Car createdCar = carService.createCar(car);
        return ResponseEntity.ok(createdCar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable ObjectId id, @RequestBody Car car) {
        Car updatedCar = carService.updateCar(userPrincipal, id, car);
        return ResponseEntity.ok(updatedCar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable ObjectId id) {
        carService.deleteCar(userPrincipal, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> findCarById(@PathVariable ObjectId id) {
        Car car = carService.findCarById(id);
        return ResponseEntity.ok(car);
    }

    @GetMapping
    public ResponseEntity<List<Car>> findAllCars() {
        List<Car> cars = carService.findAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(@RequestParam String query, @RequestParam Province province) {
        List<String> suggestions = carService.autocomplete(query, province);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Car>> search(@RequestParam String query, @RequestParam Province province) {
        List<Car> cars = carService.search(query, province);
        return ResponseEntity.ok(cars);
    }
}
