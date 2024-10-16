import { CarOutlined, DeploymentUnitOutlined, IdcardOutlined, MoneyCollectOutlined, PictureOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Tabs, TabsProps } from "antd";
import CarInformationTab from "../../modules/cars/CarInformationTab";
import { ICreateCarData } from "../../store/car/types";
import CarFeatureTab from "../../modules/cars/CarFeatureTab";
import CarLicenseTab from "../../modules/cars/CarLicenseTab";
import CarImageTab from "../../modules/cars/CarImageTab";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/es/upload";
import JoditEditor from 'jodit-react';
import RentFeeTab from "../../modules/cars/RentFeeTab";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

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

const EditCarModal = ({ carData, setOpen }: {
    carData: ICreateCarData;
    setOpen: (open: boolean) => void;
}) => {
    const [screenShot, setScreenShot] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (carData?.image_url?.length && screenShot.length === 0) {
            const initialFileList: UploadFile[] = carData.image_url.map((url) => ({
                uid: `${uuidv4()}`,
                name: `image-${uuidv4()}.jpg`,
                status: 'done',
                url: url,
            }));
            setScreenShot(initialFileList);
        }
    }, [carData, screenShot]);

    const onFinish = (values: ICreateCarData) => {
        const newValues = {
            ...values,
            image_url: screenShot.map((file) => file.url),
            manufacturing_year: dayjs(values.manufacturing_year).year(),
            registration_date: dayjs(values.registration_date).format('YYYY-MM-DD'),
        };
        console.log("onFinish ~ newValues:", newValues)
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
            children: <CarFeatureTab features={carData?.features} />,
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
            children: <CarImageTab screenShot={screenShot} setScreenShot={setScreenShot} />, // Passing only screenShot and setScreenShot
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
                <JoditEditor key="description" config={config} />
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
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
                ...carData,
                manufacturing_year: carData.manufacturing_year ? dayjs().year(carData.manufacturing_year) : null,
                registration_date: carData.registration_date ? dayjs(carData?.registration_date) : null,
            }}
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
    );
};

export default EditCarModal;
