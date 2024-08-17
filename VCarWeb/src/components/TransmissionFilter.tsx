import React from "react";
import CustomCheckbox from "./common/CustomCheckbox";

interface TransmissionFilterProps {
  transmission: string[];
  onTransmissionChange: (value: string) => void;
}

const TransmissionFilter: React.FC<TransmissionFilterProps> = ({
  transmission,
  onTransmissionChange,
}) => {
  const handleTransmissionChange = (value: string) => {
    if (transmission.includes(value)) {
      onTransmissionChange(value);
    } else {
      onTransmissionChange(value);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Transmission</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <CustomCheckbox
            checked={transmission.includes("AUTO")}
            onChange={() => handleTransmissionChange("AUTO")}
          />
          Automatic
        </label>
        <label className="flex items-center gap-2">
          <CustomCheckbox
            checked={transmission.includes("MANUAL")}
            onChange={() => handleTransmissionChange("MANUAL")}
          />
          Manual
        </label>
      </div>
    </div>
  );
};

export default TransmissionFilter;
