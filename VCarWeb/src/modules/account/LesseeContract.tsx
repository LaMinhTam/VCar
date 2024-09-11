import { useMemo, useState } from "react";
import { Table, Tag, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GET_LESSEE_CONTRACTS } from "../../store/rental/action";
import { RootState } from "../../store/store";
import { IContractData, IContractParams } from "../../store/rental/types";
import { TablePaginationConfig } from "antd/es/table";
import { formatPrice } from "../../utils";

const LesseeContract = () => {
    const dispatch = useDispatch();
    const { lesseeListContract, loading } = useSelector((state: RootState) => state.rental);

    const [params, setParams] = useState<IContractParams>({
        sortDescending: "",
        page: "0",
        size: "10",
    });

    useMemo(() => {
        dispatch({ type: GET_LESSEE_CONTRACTS, payload: params });
    }, [dispatch, params]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
    ) => {
        setParams({
            ...params,
            page: String((pagination.current ?? 1) - 1),
            size: String(pagination.pageSize ?? 10),
        });
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_text: string, _record: IContractData, index: number) => index + 1,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLesseeSigned',
            key: 'isLesseeSigned',
            render: (isLesseeSigned: boolean) => (
                <Tag color={isLesseeSigned ? 'green' : 'orange'}>
                    {isLesseeSigned ? 'Đã ký' : 'Chưa ký'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo hợp đồng',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Biển số xe',
            dataIndex: 'vehicle_license_plate',
            key: 'vehicle_license_plate',
        },
        {
            title: 'Tổng tiền thuê',
            dataIndex: 'total_rental_value',
            key: 'total_rental_value',
            render: (value: number) => formatPrice(value) + ' VND',
        },
        {
            title: 'Địa điểm nhận xe',
            dataIndex: 'vehicle_hand_over_location',
            key: 'vehicle_hand_over_location',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_text: string, record: IContractData) => (
                <Typography.Link onClick={() => handleViewDetail(record)}>View detail</Typography.Link>
            ),
        },
    ];

    const handleViewDetail = (record: IContractData) => {
        // Handle view detail logic here
    };

    return (
        <div className="p-4">
            <Typography.Title level={3}>Danh sách hợp đồng</Typography.Title>
            <Table
                className="w-full"
                columns={columns}
                dataSource={lesseeListContract}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: Number(params.size),
                    current: Number(params.page) + 1,
                    total: lesseeListContract.length,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default LesseeContract;
