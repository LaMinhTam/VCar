import { Button, Col, DatePicker, Divider, Empty, Flex, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchRentalContractSummary } from '../../../store/stats/handlers';
import { ContractParamsType, IRentalContractSummary } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMM, formatDateToDDMMYYYY, getDateRange } from '../../../utils/helper';
import CustomDualAxes from '../../../components/common/CustomDualAxes';

const { RangePicker } = DatePicker;

const StatisticCard = ({ params, setParams, type }: {
    params: ContractParamsType,
    setParams: (params: ContractParamsType) => void
    type: string
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [rentalContractSummary, setRentalContractSummary] = useState<IRentalContractSummary[]>([] as IRentalContractSummary[]);
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
        const response = await fetchRentalContractSummary(params);
        if (response?.success) {
            const newData = response?.data?.map((item: IRentalContractSummary) => {
                return {
                    ...item,
                    day_label: formatDateToDDMM(item?.day_label),
                };
            });
            setRentalContractSummary(newData);
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
                    {rentalContractSummary.length > 0 ? <CustomDualAxes data={rentalContractSummary} title={t(`${type === 'LESSOR' ? 'stat.lessor.revenueContractTitle' : 'stat.lessee.feeContractTitle'}`)} type={type} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default StatisticCard;