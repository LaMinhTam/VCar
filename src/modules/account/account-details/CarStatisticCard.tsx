import { Button, Col, DatePicker, Divider, Empty, Flex, Row, Select, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCarStatistics } from '../../../store/stats/handlers';
import { CarStatisticsParamsType, ICarStatistics } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMMYYYY, getDateRange } from '../../../utils/helper';
import CarDualAxes from '../../../components/common/CarDualAxes';

const { RangePicker } = DatePicker;

const CarStatisticCard = ({ params, setParams }: {
    params: CarStatisticsParamsType,
    setParams: (params: CarStatisticsParamsType) => void
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [rentalContractSummary, setRentalContractSummary] = useState<ICarStatistics[]>([] as ICarStatistics[]);
    const [rangePickerDates, setRangePickerDates] = useState<[Dayjs, Dayjs]>(getDateRange('year'));

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

    const handleChangeSort = (value: string) => {
        setParams({ ...params, sortOrder: value });
    }

    const handleRangeChange = (range: 'date' | 'week' | 'month' | 'year') => {
        const [startDate, endDate] = getDateRange(range);
        setParams({
            ...params,
            startDate: formatDateToDDMMYYYY(startDate.toDate()),
            endDate: formatDateToDDMMYYYY(endDate.toDate()),
        });
        setRangePickerDates([startDate, endDate]);
    };

    const fetchUserContractSummary = async () => {
        setLoading(true);
        const response = await fetchCarStatistics(params);
        if (response?.success) {
            setRentalContractSummary(response?.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useMemo(() => {
        fetchUserContractSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Flex align='center' justify='flex-end'>
                    <Flex>
                        <Select
                            value={params.sortOrder || undefined}
                            className="w-[120px]"
                            onChange={handleChangeSort}
                            placeholder={t('common.sortDate')}
                            options={[
                                { value: 'ASC', label: t('common.ASC') },
                                { value: 'DESC', label: t('common.DESC') },
                            ]}
                        />
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
                    {rentalContractSummary.length > 0 ? <CarDualAxes data={rentalContractSummary} title={t(`stat.revenueCarTitle`)} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default CarStatisticCard;