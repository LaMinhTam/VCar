import { Button, Col, DatePicker, Divider, Empty, Flex, Radio, RadioChangeEvent, Row, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserStatisticContract } from '../../../store/stats/handlers';
import { ContractUserParamsType, IUserContractSummary } from '../../../store/stats/types';
import { Dayjs } from 'dayjs';
import { formatDateToDDMMYYYY, formatDateToDDMMYYYYHHMMSS, getDateRange } from '../../../utils/helper';
import UserDualAxes from '../../../components/charts/UserDualAxes';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx-js-style';

const { RangePicker } = DatePicker;


const UserStatisticCard = ({ params, setParams }: {
    params: ContractUserParamsType,
    setParams: (params: ContractUserParamsType) => void
}) => {
    const { t } = useTranslation();
    const Options = [
        { label: t('common.lessee'), value: "false" },
        { label: t('common.lessor'), value: "true" }
    ]
    const [loading, setLoading] = useState(false);
    const [userSummary, setUserSummary] = useState<IUserContractSummary[]>([] as IUserContractSummary[]);
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
            filterByLessor: e.target.value
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

    const fetchUserContractSummary = async () => {
        setLoading(true);
        const response = await fetchUserStatisticContract(params);
        if (response?.success) {
            setUserSummary(response?.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const headers = {
            name: t('excel.dayLabel'),
            total_contracts: t('excel.totalContracts'),
            total_value: t('excel.total_value'),
        };

        // Translate sheet title
        const sheetTitle = t(`excel.userStatTitle`);

        // Create worksheet with data (without headers)
        const worksheet = XLSX.utils.json_to_sheet(userSummary);

        // Add title row
        XLSX.utils.sheet_add_aoa(worksheet, [[sheetTitle]], { origin: "A1" });

        // Add headers row
        XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headers)], { origin: "A2" });

        // Merge cells for the title
        worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(headers).length - 1 } }];

        // Set column widths
        const maxWidth = Math.max(...Object.values(headers).map(h => h.length), 15);
        const colWidth = Array(Object.keys(headers).length).fill({ wch: maxWidth });
        worksheet["!cols"] = colWidth;

        // Style for title and header
        const titleHeaderStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        // Apply style to title
        const titleRange = XLSX.utils.decode_range(`A1:${XLSX.utils.encode_col(Object.keys(headers).length - 1)}1`);
        for (let C = titleRange.s.c; C <= titleRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: titleRange.s.r, c: C });
            worksheet[cellAddress] = worksheet[cellAddress] || { v: "", t: "s" };
            worksheet[cellAddress].s = titleHeaderStyle;
        }

        // Apply style to header
        const headerRange = XLSX.utils.decode_range(`A2:${XLSX.utils.encode_col(Object.keys(headers).length - 1)}2`);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
            worksheet[cellAddress].s = titleHeaderStyle;
        }

        // Set row height for title and header
        worksheet['!rows'] = [{ hpt: 30 }, { hpt: 25 }];

        // Apply borders and center alignment to all data cells
        const dataStyle = {
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        const dataRange = XLSX.utils.decode_range(worksheet['!ref']!);

        for (let R = 2; R <= dataRange.e.r; ++R) {
            for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = dataStyle;
                }
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

        // Generate Excel file
        const fileName = `${t('excel.userSummaryFile')}_admin_${formatDateToDDMMYYYYHHMMSS(new Date())}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    useMemo(() => {
        fetchUserContractSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <Spin spinning={loading}>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align='center' justify='space-between'>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={exportToExcel}
                            disabled={userSummary.length === 0}
                        >
                            {t('common.exportToExcel')}
                        </Button>
                        <Flex>
                            <Radio.Group buttonStyle="solid" options={Options} value={params?.filterByLessor} optionType="button" onChange={handleChangeStatus} />
                            {["date", "week", "month", "year"].map((item, index) => (
                                <Button key={index} type="link" onClick={() => handleRangeChange(item as 'date' | 'week' | 'month' | 'year')}>{t(`common.${item}`)}</Button>
                            ))}
                        </Flex>
                        <RangePicker value={rangePickerDates} onChange={handleChangeDate} placeholder={[t('common.fromDate'), t('common.toDate')]} />
                    </Flex>
                </Col>
                <Divider className='m-0'></Divider>
                <Col span={24}>
                    {userSummary.length > 0 ? <UserDualAxes data={userSummary} title={t('stat.admin.userTitle')} /> : <Empty />}
                </Col>
            </Row>
        </Spin>
    );
};

export default UserStatisticCard;