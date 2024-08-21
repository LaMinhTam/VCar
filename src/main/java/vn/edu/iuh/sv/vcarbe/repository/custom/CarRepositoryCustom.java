package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarModel;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.Transmission;

import java.util.List;

public interface CarRepositoryCustom {
    List<String> autocomplete(String query, Province province);

    CarModel findByIdCustom(ObjectId id);

    List<CarDTO> search(String query, Province province, Transmission[] transmission, Integer[] seats, Integer minConsumption, Integer maxConsumption, Integer maxRate, Pageable pageable);
}
