import React, { useState } from "react";
import TransmissionFilter from "./TransmissionFilter";
import SeatsFilter from "./SeatsFilter";
import FuelConsumptionFilter from "./FuelConsumptionFilter";
import MaxRateFilter from "./MaxRateFilter";

const FilterSidebar = ({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) => {
  const [transmission, setTransmission] = useState<string[]>([]);
  const [seats, setSeats] = useState<number[]>([]);
  const [minConsumption, setMinConsumption] = useState<number>(0);
  const [maxConsumption, setMaxConsumption] = useState<number>(20);
  const [maxRate, setMaxRate] = useState<number>(1000000); // Default max rate in VND

  const handleTransmissionChange = (value: string) => {
    setTransmission((prevTransmission) =>
      prevTransmission.includes(value)
        ? prevTransmission.filter((trans) => trans !== value)
        : [...prevTransmission, value]
    );
  };

  const handleSeatsChange = (value: number) => {
    setSeats((prevSeats) =>
      prevSeats.includes(value)
        ? prevSeats.filter((seat) => seat !== value)
        : [...prevSeats, value]
    );
  };

  const handleConsumptionChange = (min: number, max: number) => {
    setMinConsumption(min);
    setMaxConsumption(max);
  };

  const handleRateChange = (value: number) => {
    if (value > 10000000) {
      setMaxRate(10000000);
    } else {
      setMaxRate(value);
    }
  };

  const handleInputChange = (value: number) => {
    if (value > 10000000) {
      setMaxRate(10000000);
    } else {
      setMaxRate(value);
    }
  };

  const handleApplyFilters = () => {
    onFilterChange({
      transmission,
      seats,
      minConsumption,
      maxConsumption,
      maxRate,
    });
  };

  return (
    <div className="w-64 p-4 bg-white shadow-md fixed top-0 left-0 h-full overflow-y-auto">
      <TransmissionFilter
        transmission={transmission}
        onTransmissionChange={handleTransmissionChange}
      />
      <SeatsFilter seats={seats} onSeatsChange={handleSeatsChange} />
      <FuelConsumptionFilter
        minConsumption={minConsumption}
        maxConsumption={maxConsumption}
        onConsumptionChange={handleConsumptionChange}
      />
      <MaxRateFilter
        maxRate={maxRate}
        onRateChange={handleRateChange}
        onInputChange={handleInputChange}
      />
      <button
        onClick={handleApplyFilters}
        className="bg-primary-default text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
