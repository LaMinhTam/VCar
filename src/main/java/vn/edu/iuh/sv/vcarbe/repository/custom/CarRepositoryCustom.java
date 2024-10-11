package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Province;

import java.util.List;

public interface CarRepositoryCustom {
    List<String> autocomplete(String query, Province province);

    CarDetailDTO findByIdCustom(ObjectId id);

    List<CarDTO> search(SearchCriteria criteria, Pageable pageable);

    List<CarDTO> findByOwner(ObjectId id);
}
