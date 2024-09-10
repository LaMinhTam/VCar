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
