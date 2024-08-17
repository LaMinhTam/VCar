import React from "react";
import CustomCheckbox from "./common/CustomCheckbox";

interface SeatsFilterProps {
  seats: number[];
  onSeatsChange: (value: number) => void;
}

const SeatsFilter: React.FC<SeatsFilterProps> = ({ seats, onSeatsChange }) => {
  const handleSeatsChange = (value: number | string) => {
    if (value === "More") {
      onSeatsChange(10); // Set value to 10 if "More" is selected
    } else {
      if (seats.includes(value as number)) {
        onSeatsChange(value as number); // Uncheck the value if it's already selected
      } else {
        onSeatsChange(value as number); // Check the value if it's not selected
      }
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Seats</h3>
      <div className="flex flex-col gap-2">
        {[2, 4, 6, 8, "More"].map((num) => (
          <label key={num} className="flex items-center gap-2">
            <CustomCheckbox
              checked={
                num === "More"
                  ? seats.includes(10)
                  : seats.includes(num as number)
              }
              onChange={() => handleSeatsChange(num)}
            />
            {num} person
          </label>
        ))}
      </div>
    </div>
  );
};

export default SeatsFilter;
