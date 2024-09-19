import { Avatar, Button, Col, Divider, Form, Modal, Row, Spin, Tag, Typography } from "antd";
import { IContractData, IVehicleHandoverResponseData } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays } from "../../utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { IUser } from "../../store/auth/types";
import { axiosPrivate } from "../../apis/axios";
import CreateVehicleHandover from "./CreateVehicleHandover";
import { getVehicleHandoverByContractId } from "../../store/rental/handlers";

const LessorContractModal = ({ record }: {
    record: IContractData;
}) => {
    const [loading, setLoading] = useState(false);
    const [vehicleHandover, setVehicleHandover] = useState<IVehicleHandoverResponseData>({} as IVehicleHandoverResponseData);
    const [createHandoverLoading, setCreateHandoverLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [lesseeInfo, setLesseeInfo] = useState<IUser>();
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [handoverForm] = Form.useForm();
    const handleOk = async () => {
        handoverForm.submit();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleViewContract = async () => {
        setViewLoading(true);

        // Tải template từ thư mục public
        const templateUrl = "/template_contract.docx";
        const response = await fetch(templateUrl);
        const content = await response.arrayBuffer();

        // Sử dụng PizZip để đọc file docx
        const zip = new PizZip(content);

        // Khởi tạo Docxtemplater với dữ liệu từ file docx
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Điền dữ liệu vào template
        const data = {
            Day: new Date(record?.created_at).getDate(),
            Month: new Date(record?.created_at).getMonth() + 1,
            Year: new Date(record?.created_at).getFullYear(),
            DiaDiem: record?.vehicle_hand_over_location || '',
            TenBenA: record?.vehicle_owner_name || '',
            CMNDBenA: record?.lessor_identity_number || '',
            A1_D: '01',
            A1_M: '01',
            A1_Y: '2020',
            A1_Z: 'Hồ Chí Minh',
            DiaChiBenA: record?.lessor_contact_address,
            DienThoaiBenA: record?.lessor_phone_number,
            TenBenB: lesseeInfo?.display_name || '',
            CMNDBenB: '987654321',
            B1_D: '01',
            B1_M: '01',
            B1_Y: '2020',
            B1_Z: 'Hà Nội',
            PassportBenB: 'P123456',
            B2_D: '01',
            B2_M: '01',
            B2_Y: '2020',
            B2_Z: 'Hà Nội',
            GPLXBenB: 'G123456',
            B3_D: '01',
            B3_M: '01',
            B3_Y: '2020',
            B3_Z: 'Hà Nội',
            DiaChiBenB: '',
            DienThoaiBenB: lesseeInfo?.phone_number,
            BienSoXe: record?.vehicle_license_plate || '',
            NhanHieu: car?.name,
            NamSanXuat: record?.vehicle_manufacturing_year || '2021',
            MauXe: 'Đen',
            SoDKXe: record?.vehicle_registration_number || '',
            NgayCapGiayDK: record?.vehicle_registration_date || '',
            NoiCapGiayDK: record?.vehicle_registration_location || '',
            TenChuXe: record?.vehicle_owner_name || '',
            DonGiaThue: record?.rental_price_per_day?.toString() || '',
            GioiHanQuangDuong: record?.mileage_limit_per_day?.toString() || '',
            PhiVuotQuangDuong: record?.extra_mileage_charge?.toString() || '',
            GioBDThue: new Date(record?.rental_start_date).getHours().toString() || '',
            PhutBDThue: new Date(record?.rental_start_date).getMinutes().toString() || '',
            NgayBDThue: new Date(record?.rental_start_date).toLocaleDateString() || '',
            GioKTThue: new Date(record?.rental_end_date).getHours().toString() || '',
            PhutKTThue: new Date(record?.rental_end_date).getMinutes().toString() || '',
            NgayKTThue: new Date(record?.rental_end_date).toLocaleDateString() || '',
            PhiVuotTGThue: record?.extra_hourly_charge?.toString() || '',
            TongTienThue: record?.total_rental_value?.toString() || '',
            DiaDiemBanGiaoXe: record?.vehicle_hand_over_location || ''
        };
        doc.render(data);

        // Xuất file hợp đồng đã điền
        const blob = doc.getZip().generate({ type: 'blob' });
        saveAs(blob, 'Hop-dong-thue-xe.docx');

        setViewLoading(false);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        setLoading(true);
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
        setLoading(false);
    }, [dispatch, record?.car_id])

    useEffect(() => {
        async function fetchVehicleHandover() {
            const response = await getVehicleHandoverByContractId(record?.id);
            if (response?.success) {
                setLoading(false);
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
            } else {
                setLoading(false);
            }
        }
        fetchVehicleHandover();
    }, [record?.id])

    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                const response = await axiosPrivate.get(`/users/${record?.lessee_id}`);
                if (response.data.code === 200) {
                    setLoading(false);
                    setLesseeInfo(response.data.data);
                }
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        fetchUser();
    }, [record?.lessee_id])
    if (!record) return null;
    return (
        <>
            {loading ? <div className='flex items-center justify-center'><Spin size="large"></Spin></div> : <><Row gutter={[12, 12]} justify={"start"}>
                <Col span={12}>
                    <div className='w-full h-full p-4 rounded-lg shadow-md'>
                        <Typography.Title level={4}>Chủ xe</Typography.Title>
                        <Divider></Divider>
                        <div className='flex items-start gap-x-2'>
                            <Avatar size={"large"} src={DEFAULT_AVATAR} className='cursor-pointer' alt='Avatar'></Avatar>
                            <div>
                                <Typography.Title level={5} className='cursor-pointer'>{car?.owner?.display_name}</Typography.Title>
                                <div className='flex flex-col gap-y-2'>
                                    <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{car?.owner?.phone_number}</Typography.Text>
                                    <Typography.Text><MailOutlined className='mr-2 text-xl' />{car?.owner?.email}</Typography.Text>
                                </div>
                            </div>
                            <Button type='primary' className='ml-auto'>Nhắn tin</Button>
                        </div>
                        <Divider></Divider>
                        <Row gutter={[0, 12]}>
                            <Col span={24}>
                                <Typography.Title level={5}>Ngày bắt đầu thuê:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_start_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Ngày kết thúc thuê:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_end_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Địa điểm lấy xe:</Typography.Title>
                                <Typography.Text>{record?.vehicle_hand_over_location}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Trạng thái hợp đồng: <Tag color={
                                    record?.rental_status === 'SIGNED' ? 'green' :
                                        record?.rental_status === 'PENDING' ? 'orange' :
                                            record?.rental_status === 'CANCELED' ? 'red' : 'blue'
                                }>{record?.rental_status}</Tag></Typography.Title>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={12}>
                    <RentalSummary
                        car={car}
                        totalDays={numberOfDays}
                    ></RentalSummary>
                </Col>
                <Divider className="m-2"></Divider>
                <Col span={8} offset={16}>
                    <Typography.Title level={5}>Trạng thái xe: <Tag color={
                        vehicleHandover?.lessee_approved ? 'green' : 'orange'
                    }>{vehicleHandover?.lessee_approved ? 'Đã bàn giao' : 'Chưa bàn giao'}</Tag></Typography.Title>
                </Col>
                <Divider className="m-0"></Divider>
                <Col span={24}>
                    <Col span={24}>
                        <div className="flex items-center justify-end h-10 rounded-lg gap-x-3 bg-lite">
                            <Button type="text" onClick={handleViewContract} loading={viewLoading}>View Contract</Button>
                            {record?.rental_status === 'SIGNED' && vehicleHandover?.id && <Button type="text">View handover document</Button>}
                            {record?.rental_status === 'SIGNED' && !vehicleHandover?.id && <Button type="primary" onClick={() => setIsModalOpen(true)}>Create Handover</Button>}
                        </div>
                    </Col>
                </Col>
            </Row>
                <Modal title="Tạo biên bản bàn giao" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ loading: createHandoverLoading }}>
                    <CreateVehicleHandover form={handoverForm} rental_contract_id={record.id} setCreateHandoverLoading={setCreateHandoverLoading} setVehicleHandover={setVehicleHandover} />
                </Modal></>}
        </>
    );
};

export default LessorContractModal;