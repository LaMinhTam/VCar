import { DualAxes } from '@ant-design/plots';
// import { useTranslation } from 'react-i18next';
import numeral from 'numeral';

interface DataItem {
    year_month: string;
    total_contracts: number;
    total_free_cars: number;
    total_rented_cars: number;
    total_income: number;
}

const DoubleBarDualAxes = ({ data, title }: { data: DataItem[], title: string }) => {
    // const { t } = useTranslation();

    const barData = data.flatMap(item => [
        { year_month: item.year_month, value: item.total_contracts, type: 'total_contracts' },
        { year_month: item.year_month, value: item.total_income, type: 'total_income' }
    ]);

    const lineData = data.flatMap(item => [
        { year_month: item.year_month, count: item.total_free_cars, name: 'total_free_cars' },
        { year_month: item.year_month, count: item.total_rented_cars, name: 'total_rented_cars' }
    ]);

    const config = {
        xField: 'year_month',
        title,
        children: [
            {
                data: barData,
                type: 'interval',
                yField: 'value',
                colorField: 'type',
                group: true,
                style: { maxWidth: 80 },
                interaction: { elementHighlight: { background: true } },
            },
            {
                data: lineData,
                type: 'line',
                yField: 'count',
                colorField: 'name',
                style: { lineWidth: 2 },
                axis: { y: { position: 'right' } },
                scale: { series: { independent: true } },
                interaction: {
                    tooltip: {
                        crosshairs: false,
                        marker: false,
                    },
                },
            },
        ],
        legend: {
            position: 'top',
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
        },
        yAxis: {
            value: {
                label: {
                    formatter: (v: string) => `${numeral(Number(v)).format('0,0')} đ`,
                },
            },
        },
        tooltip: {
            shared: true,
            showMarkers: false,
        },
    };

    return <DualAxes {...config} />;
};

export default DoubleBarDualAxes;