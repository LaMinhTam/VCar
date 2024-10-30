import { CarOutlined, DeploymentUnitOutlined, IdcardOutlined, MoneyCollectOutlined, PictureOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, message, Spin, Tabs, TabsProps } from "antd";
import CarInformationTab from "../../modules/cars/CarInformationTab";
import { ICreateCarData, IQueryCarOwner } from "../../store/car/types";
import CarFeatureTab from "../../modules/cars/CarFeatureTab";
import CarLicenseTab from "../../modules/cars/CarLicenseTab";
import CarImageTab from "../../modules/cars/CarImageTab";
import { useState } from "react";
import { UploadFile } from "antd/es/upload";
import JoditEditor from 'jodit-react'
import RentFeeTab from "../../modules/cars/RentFeeTab";
import { connectWallet, getUserInfoFromCookie, getWalletBalance, handleUploadFile, sendTransaction } from "../../utils";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { createCar } from "../../store/car/handlers";

const config = {
    uploader: {
        insertImageAsBase64URI: false,
    },
    allowResizeX: false,
    allowResizeY: false,
    minWidth: 952,
    maxWidth: 952,
    width: 952,
}

const CreateCarModal = ({ params, setParams, setOpen }: {
    setOpen: (open: boolean) => void;
    params: IQueryCarOwner
    setParams: (params: IQueryCarOwner) => void;
}) => {
    const dispatch = useDispatch();
    const userInfo = getUserInfoFromCookie();
    const [screenShot, setScreenShot] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values: ICreateCarData) => {
        setLoading(true);
        const newValues = {
            ...values,
            manufacturing_year: dayjs(values.manufacturing_year).year(),
            registration_date: dayjs(values.registration_date).format('YYYY-MM-DD'),
        };
        const address = await connectWallet();
        if (address) {
            const balance = await getWalletBalance(address);
            if (balance !== null && parseFloat(balance) < 0.05) {
                message.error('Số dư trong ví không đủ để thực hiện giao dịch');
                setLoading(false);
                return;
            } else {
                const transactionResult = await sendTransaction(import.meta.env.VITE_VCAR_OWNER_METAMASK_ADDRESS, '0.05');
                if (transactionResult.success) {
                    const files = screenShot.map((shot) => shot.originFileObj as File);
                    if (files.length === 0) {
                        message.error('Vui lòng tải lên ít nhất 1 hình ảnh');
                        setLoading(false);
                        return;
                    } else {
                        const uploadPromises = files.map((file) => {
                            const timestamp = new Date().getTime();
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME);
                            formData.append('folder', `users/${userInfo?.id}/my_cars/img/${timestamp}`);
                            return handleUploadFile(formData, dispatch);
                        });
                        const imageUrls = await Promise.all(uploadPromises);
                        if (imageUrls.length === files.length) {
                            newValues.image_url = imageUrls
                            const response = await createCar(newValues);
                            if (response.success) {
                                setLoading(false);
                                message.success('Tạo xe thành công');
                                setParams({ ...params, page: '1' });
                                setOpen(false);
                            } else {
                                setLoading(false);
                                message.error('Lỗi hệ thống, chúng tôi sẽ chuyển lại phí giao dịch cho bạn trong vòng 24h');
                            }
                        } else {
                            message.error('Some images failed to upload');
                            setLoading(false);
                        }
                    }
                } else {
                    setLoading(false);
                    message.error(transactionResult.message)
                }
            }
        } else {
            setLoading(false);
            message.error('Vui lòng kết nối ví để thực hiện giao dịch');
        }
    }

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Xe',
            children: <CarInformationTab />,
            icon: <CarOutlined />,
        },
        {
            key: '2',
            label: 'Chức năng',
            children: <CarFeatureTab />,
            icon: <DeploymentUnitOutlined />
        },
        {
            key: '3',
            label: 'Giấy tờ xe',
            children: <CarLicenseTab />,
            icon: <IdcardOutlined />
        },
        {
            key: '4',
            label: 'Hình ảnh',
            children: <CarImageTab screenShot={screenShot} setScreenShot={setScreenShot} />,
            icon: <PictureOutlined />
        },
        {
            key: '5',
            label: 'Mô tả',
            children: <Form.Item
                name="description"
                required
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mô tả',
                    },
                ]}
            >
                <JoditEditor value="" key="description" config={config} />
            </Form.Item>,
            icon: <ProfileOutlined />
        },
        {
            key: '6',
            label: 'Phí thuê và chi phí khác',
            children: <RentFeeTab />,
            icon: <MoneyCollectOutlined />
        }
    ];
    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Tabs
                    items={tabs}
                    defaultActiveKey="1"
                />
                <Divider></Divider>
                <Flex gap={16} align="center" justify="flex-end">
                    <Button onClick={() => setOpen(false)} type="default" style={{
                        padding: '4px 15px',
                        width: 120
                    }}>Hủy</Button>
                    <Button type="primary" style={{
                        padding: '4px 15px',
                        width: 120
                    }} htmlType="submit">Tạo</Button>
                </Flex>
            </Form>
        </Spin>
    );
};

export default CreateCarModal;