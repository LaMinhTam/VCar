package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.CarStatisticDto;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceSummaryDto;
import vn.edu.iuh.sv.vcarbe.dto.ProvinceCarCountDto;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractSummaryDto;

import java.util.Date;
import java.util.List;

public interface StatisticService {
    List<InvoiceSummaryDto> getDailyInvoiceSummary(Date startDate, Date endDate, String type);

    List<RentalContractSummaryDto> getDailyRentalContractSummary(Date startDate, Date endDate, String rentalStatus, ObjectId lessor, ObjectId lesse);

    List<ProvinceCarCountDto> getCarsByProvince();

    List<RentalContractSummaryDto> getContractStatistics(Date startDate, Date endDate, boolean filterByLessor, String sortBy, String sortOrder);

    List<CarStatisticDto> getCarStatistics(Date startDate, Date endDate, ObjectId ownerId, String sortBy, String sortOrder);
}
