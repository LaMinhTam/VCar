export interface IRentalState {
  loading: boolean;
  error: string | null;
  lesseeRequest: IRentalData;
  lessorListRequest: IRentalData[];
  lesseeListRequest: IRentalData[];
}

export interface IRentalData {
  id: string;
  car_id: string;
  lessee_id: string;
  lessor_id: string;
  status: string;
  created_at: number;
  updated_at: number;
  rental_start_date: number;
  rental_end_date: number;
  vehicle_hand_over_location: string;
}

export interface IRentalRequestParams {
  sortDescending: string;
  page: string;
  size: string;
  status: string;
}

export interface ILessorApproveRequestResponse {
  id:                            string;
  owner:                         string;
  lessee:                        string;
  created_at:                    number;
  car_id:                        string;
  vehicle_license_plate:         string;
  vehicle_manufacturing_year:    number;
  vehicle_registration_number:   string;
  vehicle_registration_date:     string;
  vehicle_registration_location: string;
  vehicle_owner_name:            string;
  rental_price_per_day:          number;
  mileage_limit_per_day:         number;
  extra_mileage_charge:          number;
  rental_start_date:             number;
  rental_end_date:               number;
  extra_hourly_charge:           number;
  total_rental_value:            number;
  vehicle_hand_over_location:    string;
}
