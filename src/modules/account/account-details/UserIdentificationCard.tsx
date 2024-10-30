import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Row, Typography, Upload, UploadFile, UploadProps } from "antd";
import { getUserInfoFromCookie } from "../../../utils";

const UserIdentificationCard = ({
    onEditIdentification,
    setOnEditIdentification,
    fileListIdentification,
    handleChangeIdentification,
    handleRemoveIdentification,
    identificationImageUrl,
    handleUpdateCitizenIdentification,
    loading
}: {
    onEditIdentification: boolean;
    setOnEditIdentification: (value: boolean) => void;
    fileListIdentification: UploadFile[];
    handleChangeIdentification: UploadProps["onChange"];
    handleRemoveIdentification: () => void;
    identificationImageUrl: string;
    handleUpdateCitizenIdentification: () => Promise<void>;
    loading: boolean;
}) => {
    const userInfo = getUserInfoFromCookie();
    return (
        <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Typography.Title level={3}>Căn cước công dân</Typography.Title>
                        {!onEditIdentification && (<Button icon={<EditOutlined />} type="dashed" onClick={() => setOnEditIdentification(true)}>Chỉnh sửa</Button>)}
                        {onEditIdentification && (
                            <Flex gap={4} align="center">
                                <Button type="default" onClick={() => setOnEditIdentification(false)}>Hủy</Button>
                                <Button type="primary" loading={loading} onClick={handleUpdateCitizenIdentification}>Cập nhật</Button>
                            </Flex>
                        )}
                    </Flex>
                </Col>
                <Col span={12}>
                    <Flex gap={5} align="center" className="mb-5">
                        <Typography.Title style={{ marginBottom: 0 }} level={4}>Hình ảnh</Typography.Title>
                        <Upload
                            fileList={fileListIdentification}
                            onChange={handleChangeIdentification}
                            beforeUpload={() => false}
                            maxCount={1}
                            onRemove={handleRemoveIdentification}
                            disabled={!onEditIdentification}
                        >
                            {fileListIdentification.length < 1 && (
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            )}
                        </Upload>
                    </Flex>
                    {identificationImageUrl && (
                        <img
                            src={identificationImageUrl}
                            alt="Preview"
                            style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col span={12}>
                    <Form layout="vertical">
                        <Typography.Title level={4}>Thông tin căn cước</Typography.Title>
                        <Form.Item label="Số căn cước">
                            <Input placeholder="Nhập số căn cước" disabled value={userInfo?.citizen_identification?.citizen_identification_number} />
                        </Form.Item>
                        <Form.Item label="Ngày cấp">
                            <Input placeholder="Nhập ngày cấp" disabled value={userInfo?.citizen_identification?.issued_date} />
                        </Form.Item>
                        <Form.Item label="Nơi cấp">
                            <Input placeholder="Nhập nơi cấp" disabled value={userInfo?.citizen_identification?.issued_location} />
                        </Form.Item>
                        <Form.Item label="Địa chỉ thường trú">
                            <Input placeholder="Nhập địa chỉ thường trú" disabled value={userInfo?.citizen_identification?.permanent_address} />
                        </Form.Item>
                        <Form.Item label="Địa chỉ liên hệ">
                            <Input placeholder="Nhập địa chỉ liên hệ" disabled value={userInfo?.citizen_identification?.contact_address} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
};

export default UserIdentificationCard;