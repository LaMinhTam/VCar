import { CarOutlined, DeploymentUnitOutlined, IdcardOutlined, MoneyCollectOutlined, PictureOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Tabs, TabsProps } from "antd";
import CarInformationTab from "../../modules/cars/CarInformationTab";
import { ICreateCarData } from "../../store/car/types";
import CarFeatureTab from "../../modules/cars/CarFeatureTab";
import CarLicenseTab from "../../modules/cars/CarLicenseTab";
import CarImageTab from "../../modules/cars/CarImageTab";
import { useState } from "react";
import { UploadFile } from "antd/es/upload";
import JoditEditor from 'jodit-react'
import RentFeeTab from "../../modules/cars/RentFeeTab";

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

const CreateCarModal = ({ setOpen }: {
    setOpen: (open: boolean) => void;
}) => {
    const [screenShot, setScreenShot] = useState<UploadFile[]>([]);
    console.log("screenShot:", screenShot)
    const [form] = Form.useForm();
    const onFinish = (values: ICreateCarData) => {
        console.log(values);
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
            children: <CarImageTab setScreenShot={setScreenShot} />,
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

export default CreateCarModal;