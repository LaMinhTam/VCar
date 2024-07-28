package vn.edu.iuh.sv.vcarbe.repository.custom;

import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;

import java.util.List;

public interface CarRepositoryCustom {
    List<String> autocomplete(String query, Province province);

    List<Car> search(String query, Province province);
}
