import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IRentalData, IRentalRequestParams } from "../../store/rental/types";
import { useMemo, useState, useEffect } from "react";
import { GET_LESSEE_REQUESTS } from "../../store/rental/action";
import { Table, Typography, Tag, Modal, Flex, Radio } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import TripDetailDialog from "../../components/modals/TripDetailDialog";
import { useParams } from "react-router-dom";
import { getRentRequestById } from "../../store/rental/handlers";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { RENT_REQUEST_OPTIONS } from "../../constants";

const MyTrips = () => {
    const { lesseeListRequest, loading } = useSelector((state: RootState) => state.rental);
    const [modalRecord, setModalRecord] = useState<IRentalData>({} as IRentalData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    const [params, setParams] = useState<IRentalRequestParams>({
        sortDescending: "true",
        page: "0",
        size: "10",
        status: "",
    });

    const handleChangeStatus = (e: CheckboxChangeEvent) => {
        setParams({ ...params, status: e.target.value });
    }

    useMemo(() => {
        dispatch({ type: GET_LESSEE_REQUESTS, payload: params });
    }, [dispatch, params]);

    useEffect(() => {
        if (id) {
            fetchRentalRequestById(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, lesseeListRequest]);

    const fetchRentalRequestById = async (id: string) => {
        const response = await getRentRequestById(id);
        if (response?.success && response.data) {
            setModalRecord(response.data);
            showModal();
        }
    };

    const columns: ColumnsType<IRentalData> = [
        {
            title: 'STT',
            key: 'id',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = '';
                switch (status) {
                    case 'APPROVED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Ngày bắt đầu thuê',
            dataIndex: 'rental_start_date',
            key: 'rental_start_date',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Ngày kết thúc thuê',
            dataIndex: 'rental_end_date',
            key: 'rental_end_date',
            render: (text: number) => new Date(text).toLocaleString(),
        },
        {
            title: 'Địa điểm lấy xe',
            dataIndex: 'vehicle_hand_over_location',
            key: 'vehicle_hand_over_location',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: IRentalData) => (
                <Typography.Link onClick={() => handleViewDetail(record)}>View detail</Typography.Link>
            ),
        },
    ];

    const handleViewDetail = (record: IRentalData) => {
        setModalRecord(record);
        showModal();
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <Typography.Title level={3}>Danh sách chuyến</Typography.Title>
            <Flex justify="flex-end" className="mb-5">
                <Radio.Group buttonStyle="solid" options={RENT_REQUEST_OPTIONS} value={params?.status} optionType="button" onChange={handleChangeStatus} />
            </Flex>
            <Table
                className="w-full"
                columns={columns}
                dataSource={lesseeListRequest?.data}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: Number(params.size),
                    total: lesseeListRequest?.meta.item_count,
                    current: Number(params.page) + 1,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={(pagination: TablePaginationConfig) => {
                    setParams({
                        ...params,
                        page: String((pagination?.current ?? 1) - 1),
                        size: String(pagination?.pageSize),
                    });
                }}
            />
            <Modal title="Chi tiết yêu cầu" open={isModalOpen} onOk={handleOk} width={860} onCancel={handleCancel}>
                <TripDetailDialog record={modalRecord}></TripDetailDialog>
            </Modal>
        </div>
    );
};

export default MyTrips;