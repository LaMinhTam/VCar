package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.CarStatus;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;
import vn.edu.iuh.sv.vcarbe.util.BeanUtils;

import java.util.List;

@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarRepository carRepository;

    @Override
    public Car createCar(Car car) {
        car.setStatus(CarStatus.AVAILABLE);
        return carRepository.save(car);
    }

    @Override
    public Car updateCar(UserPrincipal userPrincipal, ObjectId id, Car car) {
        Car existingCar = carRepository.findByOwnerAndId(userPrincipal.getId().toHexString(), id).orElseThrow(() -> new AppException(404, "Car not found with id " + id));

        if (existingCar == null) {
            car.setId(id);
            return carRepository.save(car);
        } else {
            BeanUtils.copyNonNullProperties(car, existingCar);
            return carRepository.save(existingCar);
        }
    }

    @Override
    public void deleteCar(UserPrincipal userPrincipal, ObjectId id) {
        Car car = carRepository.findByOwnerAndId(userPrincipal.getId().toHexString(), id)
                .orElseThrow(() -> new AppException(404, "Car not found with id " + id));
        carRepository.delete(car);
    }

    @Override
    public Car findCarById(ObjectId id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new AppException(404, "Car not found with id " + id));
    }

    @Override
    public List<Car> findAllCars() {
        return carRepository.findAll();
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        return carRepository.autocomplete(query, province);
    }

    @Override
    public List<Car> search(String query, Province province) {
        return carRepository.search(query, province);
    }
}
