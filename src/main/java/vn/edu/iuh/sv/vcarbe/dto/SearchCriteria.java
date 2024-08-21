package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.Transmission;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchCriteria {
    private String query;
    private Province province;
    private Transmission[] transmission;
    private Integer[] seats;
    private Integer minConsumption;
    private Integer maxConsumption;
    private Integer maxRate;
    private int page = 0;
    private int size = 10;
}
