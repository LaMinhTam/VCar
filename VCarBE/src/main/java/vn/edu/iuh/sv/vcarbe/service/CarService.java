package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

import java.util.List;

public interface CarService {
    Car createCar(Car car);
    Car updateCar(UserPrincipal userPrincipal, ObjectId id, Car car);
    void deleteCar(UserPrincipal userPrincipal, ObjectId id);
    Car findCarById(ObjectId id);
    List<Car> findAllCars();
    List<String> autocomplete(String query, Province province);
    List<Car> search(String query, Province province);
}
