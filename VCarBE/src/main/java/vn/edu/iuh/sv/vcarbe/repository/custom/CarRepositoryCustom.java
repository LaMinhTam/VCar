package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarModel;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;

import java.util.List;

public interface CarRepositoryCustom {
    List<String> autocomplete(String query, Province province);

    List<CarDTO> search(String query, Province province);

    CarModel findByIdCustom(ObjectId id);

    List<Car> findByProvince(Province province, Pageable pageable);
}
