export interface ICar {
  id: string;
  owner?: Owner;
  name: string;
  status: string;
  image_url: string[];
  province: string;
  location: string;
  daily_rate: number;
  seat: number;
  transmission: string;
  fuel: string;
  fuel_consumption: number;
  description: string;
  features: string[];
  color: string;
  license_plate: string;
  registration_number: string;
  registration_date: string;
  registration_location: string;
  mileage_limit_per_day: number;
  extra_mileage_charge: number;
  extra_hourly_charge: number;
  washing_price: number;
  deodorise_price: number;
  average_rating: number;
  brand: string;
  manufacturing_year: number;
}

export interface Owner {
  id: string;
  display_name: string;
  email: string;
  phone_number: string;
  image_url?: string;
}

export interface IReview {
  id: string;
  comment: string;
  rating: number;
  lessee: Owner;
}

export type CarDetail = {
  car: ICar;
  reviews: IReview[];
  related_cars: ICar[];
};

export interface IQuerySearchCar {
  query: string;
  province: string;
  page: string;
  size: string;
  transmission: string;
  seats: string;
  minConsumption: string;
  maxRate: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rating: string;
}

export interface IQueryCarOwner {
  page: string;
  size: string;
  sortDescending: string;
  status: string;
  searchQuery: string;
}

export interface ICreateCarData {
  image_url: string[];
  province: string;
  location: string;
  name: string;
  seat: number;
  color: string;
  brand: string;
  manufacturing_year: number;
  transmission: string;
  fuel: string;
  fuel_consumption: number;
  description: string;
  features: string[];
  license_plate: string;
  registration_number: string;
  registration_date: string;
  registration_location: string;
  daily_rate: number;
  mileage_limit_per_day: number;
  extra_mileage_charge: number;
  extra_hourly_charge: number;
  washing_price: number;
  deodorise_price: number;
}
