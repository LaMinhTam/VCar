import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Row, Typography, Upload, UploadFile, UploadProps } from "antd";
import { getUserInfoFromCookie } from "../../../utils";

const UserLicenseCard = ({
    onEdit,
    setOnEdit,
    fileList,
    handleChange,
    handleRemove,
    imageUrl,
    handleUpdateLicense,
    loading
}: {
    onEdit: boolean;
    setOnEdit: (value: boolean) => void;
    fileList: UploadFile[];
    handleChange: UploadProps["onChange"];
    handleRemove: () => void;
    imageUrl: string;
    handleUpdateLicense: () => Promise<void>;
    loading: boolean;
}) => {
    const userInfo = getUserInfoFromCookie();
    return (
        <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Flex gap={4}>
                            <Typography.Title level={3}>Giấy phép lái xe</Typography.Title>
                        </Flex>
                        {!onEdit && (<Button icon={<EditOutlined />} type="dashed" onClick={() => setOnEdit(true)}>Chỉnh sửa</Button>)}
                        {onEdit && (<Flex gap={4} align="center">
                            <Button type="default" onClick={() => setOnEdit(false)}>Hủy</Button>
                            <Button type="primary" onClick={handleUpdateLicense} loading={loading}>Cập nhật</Button>
                        </Flex>)}
                    </Flex>
                </Col>
                <Col span={12}>
                    <Flex gap={5} align="center" className="mb-5">
                        <Typography.Title style={{
                            marginBottom: 0
                        }} level={4}>Hình ảnh</Typography.Title>
                        <Upload
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            onRemove={handleRemove}
                            disabled={!onEdit}
                        >
                            {fileList.length < 1 && (
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            )}
                        </Upload>
                    </Flex>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col span={12}>
                    <Form layout="vertical">
                        <Typography.Title level={4}>Thông tin chung</Typography.Title>
                        <Form.Item label="Số GPLX">
                            <Input placeholder="Nhập số GPLX đã cấp" disabled value={userInfo?.car_license?.id} />
                        </Form.Item>
                        <Form.Item label="Họ và tên">
                            <Input placeholder="Nhập đầy đủ họ tên" disabled value={userInfo?.car_license?.full_name} />
                        </Form.Item>
                        <Form.Item label="Ngày sinh">
                            <Input placeholder="Nhập ngày sinh" disabled value={userInfo?.car_license?.dob} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
};

export default UserLicenseCard;