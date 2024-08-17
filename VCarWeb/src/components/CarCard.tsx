import React from "react";
import capacityIcon from "../assets/capacity.png";
import gasStationIcon from "../assets/gas-station.png";
import transmissionIcon from "../assets/transmission.png";

interface Car {
  id: string;
  image_url: string[];
  name: string;
  daily_rate: number;
  seats: number;
  transmission: string;
  fuel_consumption: number;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={car.image_url[0]}
        alt="Car"
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{car.name}</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center mr-4">
            <img
              src={gasStationIcon}
              alt="Fuel Consumption"
              className="w-6 h-6 mr-2"
            />
            <span className="text-filter-range">
              {car.fuel_consumption} L/100km
            </span>
          </div>
          <div className="flex items-center mr-4">
            <img
              src={transmissionIcon}
              alt="Transmission"
              className="w-6 h-6 mr-2"
            />
            <span className="text-filter-range">
              {car.transmission === "MANUAL" ? "Manual" : "Automatic"}
            </span>
          </div>
          <div className="flex items-center">
            <img src={capacityIcon} alt="Seats" className="w-6 h-6 mr-2" />
            <span className="text-filter-range">{car.seat}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-primary-default">
            {car.daily_rate.toLocaleString()}K /{" "}
            <span className="text-filter-range">day</span>
          </span>
          <button className="bg-primary-default text-white px-4 py-2 rounded hover:bg-primary-dark">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
