export interface IRentalState {
  loading: boolean;
  error: string | null;
  lesseeRequest: IRentalData;
  lessorListRequest: IRentalData[];
  lesseeListRequest: IRentalData[];
  lesseeListContract: IContractData[];
  lessorListContract: IContractData[];
  uploadProgress: number;
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

export interface IContractParams {
  sortDescending: string;
  page: string;
  size: string;
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

export interface IContractData {
  id:                            string;
  lessor_id:                     string;
  lessee_id:                     string;
  created_at:                    number;
  lessor_identity_number:        string;
  lessor_permanent_address:      string;
  lessor_contact_address:        string;
  lessor_phone_number:           string;
  car_id:                        string;
  vehicle_license_plate:         string;
  vehicle_manufacturing_year:    number;
  vehicle_registration_number:   string;
  vehicle_registration_date:     Date;
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
  rental_request_id:             string;
  rental_status:                 string;
}


export interface IDigitalSignature {
  signature: string;
  message: string;
  address: string;
  signature_url?: string;
}

export interface IVehicleHandover {
  rental_contract_id: string;
  handover_date: string;
  initial_condition_normal: boolean;
  vehicle_condition: string;
  damages: string[];
  odometer_reading: number;
  fuel_level: number;
  personal_items: string;
  collateral: Collateral[];
  digital_signature: IDigitalSignature;
}

export interface HandoverFieldTypes {
  handover_date: string;
  vehicle_condition: string;
  damages: string[];
  odometer_reading: number;
  fuel_level: number;
  personal_items: string;
  collateral: Collateral[];
}

export interface IVehicleHandoverResponseData {
  id:                        string;
  lessee_id:                 string;
  lessor_id:                 string;
  lessor_name:               string;
  lessee_name:               string;
  location:                  string;
  rental_contract_id:        string;
  handover_date:             number;
  handover_hour:             number;
  initial_condition_normal:  boolean;
  vehicle_condition:         string;
  damages:                   string[];
  odometer_reading:          number;
  fuel_level:                number;
  personal_items:            string;
  collateral:                Collateral[];
  return_hour:               number;
  condition_matches_initial: boolean;
  return_odometer_reading:   number;
  return_fuel_level:         number;
  lessee_approved:           boolean;
  lessor_approved:           boolean;
  lessor_signature:          string;
  car_manufacturing_year:    number;
  car_license_plate:         string;
  car_seat:                  number;
}

export interface Collateral {
  type:    string;
  details: string;
}
