import { useMemo, useState } from "react";
import { IRentalVolume } from "../../../store/stats/types";
import { useTranslation } from "react-i18next";
import { fetchRentalVolume } from "../../../store/stats/handlers";
import dayjs, { Dayjs } from "dayjs";
import { formatDateToDDMMYYYY, getDateRange } from "../../../utils/helper";
import { RentalVolumeParams } from "../../../store/stats/models";
import { Button, Col, DatePicker, Divider, Empty, Flex, Row, Spin } from "antd";
import DoubleBarDualAxes from "../../../components/charts/DoubleBarDualAxes";

const { RangePicker } = DatePicker;

const RentalVolumeStatisticCard = () => {
    const { t } = useTranslation();
    const [rangePickerDates, setRangePickerDates] = useState<[Dayjs, Dayjs]>(getDateRange('year'));
    const [params, setParams] = useState({
        ...RentalVolumeParams,
        startDate: formatDateToDDMMYYYY(dayjs().startOf('year').toDate()),
        endDate: formatDateToDDMMYYYY(dayjs().endOf('year').toDate()),
        timeInterval: 'DAY'
    });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IRentalVolume[]>([] as IRentalVolume[]);
    const handleChangeDate = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            const [fromDate, toDate] = dates;
            setParams({
                ...params,
                startDate: fromDate ? formatDateToDDMMYYYY(fromDate.toDate()) : '',
                endDate: toDate ? formatDateToDDMMYYYY(toDate.toDate()) : '',
            });
            setRangePickerDates([fromDate, toDate]);
        }
    };
    const handleRangeChange = (range: 'date' | 'week' | 'month' | 'year') => {
        const [startDate, endDate] = getDateRange(range);
        setParams({
            ...params,
            startDate: formatDateToDDMMYYYY(startDate.toDate()),
            endDate: formatDateToDDMMYYYY(endDate.toDate()),
        });
        setRangePickerDates([startDate, endDate]);
    };
    useMemo(() => {
        async function fetchData() {
            setLoading(true);
            const response = await fetchRentalVolume(params);
            if (response?.success) {
                setData(response?.data as IRentalVolume[]);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        fetchData();
    }, [params]);
    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Flex align='center' justify='flex-end'>
                    <Flex>
                        {["date", "week", "month", "year"].map((item, index) => (
                            <Button key={index} type="link" onClick={() => handleRangeChange(item as 'date' | 'week' | 'month' | 'year')}>{t(`common.${item}`)}</Button>
                        ))}
                    </Flex>
                    <RangePicker value={rangePickerDates} onChange={handleChangeDate} placeholder={[t('common.fromDate'), t('common.toDate')]} />
                </Flex>
            </Col>
            <Divider className='m-0'></Divider>
            <Col span={24}>
                <Spin spinning={loading}>
                    {data.length > 0 ? <DoubleBarDualAxes data={data} title={t('stat.admin.titleRentalVolume')} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default RentalVolumeStatisticCard;