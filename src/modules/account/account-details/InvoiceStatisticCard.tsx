import { Button, Col, DatePicker, Divider, Empty, Flex, Radio, RadioChangeEvent, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchStatisticInvoice } from '../../../store/stats/handlers';
import { InvoiceSummaryParamsType, IStatisticInvoice } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMM, formatDateToDDMMYYYY, getDateRange } from '../../../utils/helper';
import InvoiceDualAxes from '../../../components/charts/InvoiceDualAxes';

const { RangePicker } = DatePicker;


const InvoiceStatisticCard = ({ params, setParams }: {
    params: InvoiceSummaryParamsType,
    setParams: (params: InvoiceSummaryParamsType) => void
}) => {
    const { t } = useTranslation();
    const Options = [
        { label: t('stat.admin.RENT'), value: 'RENT' },
        { label: t('stat.admin.TOKEN'), value: 'TOKEN' }
    ]
    const [loading, setLoading] = useState(false);
    const [invoiceSummary, setInvoiceSummary] = useState<IStatisticInvoice[]>([] as IStatisticInvoice[]);
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

    const handleChangeStatus = (e: RadioChangeEvent) => {
        setParams({
            ...params,
            type: e.target.value
        });
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

    const fetchInvoiceSummary = async () => {
        setLoading(true);
        const response = await fetchStatisticInvoice(params);
        if (response?.success) {
            const newData = response?.data?.map((item: IStatisticInvoice) => {
                return {
                    ...item,
                    day_label: formatDateToDDMM(item?.day_label),
                };
            });
            setInvoiceSummary(newData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useMemo(() => {
        fetchInvoiceSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Flex align='center' justify='flex-end'>
                    <Flex>
                        <Radio.Group buttonStyle="solid" options={Options} value={params?.type} optionType="button" onChange={handleChangeStatus} />
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
                    {invoiceSummary.length > 0 ? <InvoiceDualAxes data={invoiceSummary} title={t('stat.admin.transactionTitle')} /> : <Empty></Empty>}
                </Spin>
            </Col>
        </Row>
    );
};

export default InvoiceStatisticCard;