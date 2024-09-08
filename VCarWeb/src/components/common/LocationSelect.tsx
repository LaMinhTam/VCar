import { useTranslation } from "react-i18next";
import provinces from "../../config/provincesMockup";
import { Select } from "antd";

const LocationSelect = ({ className }: {
    className?: string;
}) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const provinceOptions = provinces.map(province => ({
        value: province.id.toString(),
        label: currentLanguage === "en" ? province.enName : province.vnName,
    }));
    return (
        <Select
            showSearch
            placeholder="Select a province"
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={provinceOptions}
            className={className}
            placement="bottomLeft"
        />
    );
};

export default LocationSelect;