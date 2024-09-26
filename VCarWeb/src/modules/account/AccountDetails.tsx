import { Button, Col, Divider, Flex, Form, Input, Row, Typography, Upload, UploadFile } from "antd";
import ImageUploader from "../../components/common/ImageUploader";
import { getUserInfoFromCookie, handleUploadFile } from "../../utils";
import { EditOutlined, SlidersOutlined, UploadOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import UpdateProfileModal from "../../components/modals/UpdateProfileModal";
import { useState, useEffect } from "react";
import { UploadProps } from "antd/es/upload";
import { useDispatch } from "react-redux";

const AccountDetails = () => {
    const dispatch = useDispatch();
    const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const userInfo = getUserInfoFromCookie();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const newImageUrl = URL.createObjectURL(file);
            setImageUrl(newImageUrl);
        } else {
            setImageUrl(null);
        }
    };

    const handleUpdateLicense = async () => {
        const formData = new FormData();
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `users/${userInfo?.id}`);
            const imageUrl = await handleUploadFile(formData, dispatch);
            if (imageUrl) {
                console.log("Upload success");
            } else {
                console.log("Upload failed");
            }
        }
    };

    const handleRemove = () => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(null);
    };

    useEffect(() => {
        return () => {
            // Clean up the object URL when the component unmounts
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    return (
        <>
            <Row gutter={[0, 16]}>
                <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Flex align="center" justify="space-between">
                                <Flex gap={4}>
                                    <Typography.Title level={3}>Thông tin tài khoản</Typography.Title>
                                    <Button icon={<EditOutlined />} type="text" onClick={() => setOpenUpdateProfileModal(true)}></Button>
                                </Flex>
                                <Flex align="center" gap={4} className="inline-flex px-4 py-2 border rounded-lg border-text3">
                                    <SlidersOutlined className="text-lg" />
                                    <Typography.Text className="text-3xl font-bold text-primary">0</Typography.Text>
                                    <Typography.Text className="text-text3">chuyến</Typography.Text>
                                </Flex>
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex gap={12} vertical align="center">
                                <ImageUploader></ImageUploader>
                                <Typography.Title level={5}>{userInfo?.display_name}</Typography.Title>
                                <Typography.Text>Tham gia: 05/09/2024</Typography.Text>
                            </Flex>
                        </Col>
                        <Col span={18}>
                            <Row gutter={[0, 16]}>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Ngày sinh</Typography.Text>
                                        <Typography.Text>17/11/2003</Typography.Text>
                                    </Flex>
                                </Col>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Giới tính</Typography.Text>
                                        <Typography.Text>Nam</Typography.Text>
                                    </Flex>
                                </Col>
                                <Divider className="m-0"></Divider>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Email</Typography.Text>
                                        <Typography.Text>{userInfo?.email}</Typography.Text>
                                    </Flex>
                                </Col>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Số điện thoại</Typography.Text>
                                        <Typography.Text>0987654321</Typography.Text>
                                    </Flex>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
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
                                    <Button type="primary" onClick={handleUpdateLicense}>Cập nhật</Button>
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
                                    <Input placeholder="Nhập số GPLX đã cấp" />
                                </Form.Item>
                                <Form.Item label="Họ và tên">
                                    <Input placeholder="Nhập đầy đủ họ tên" />
                                </Form.Item>
                                <Form.Item label="Ngày sinh">
                                    <Input placeholder="Nhập ngày sinh" />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Cập nhật thông tin cá nhân" footer={false} open={openUpdateProfileModal} onCancel={() => setOpenUpdateProfileModal(false)}>
                <UpdateProfileModal setOpenUpdateProfileModal={setOpenUpdateProfileModal}></UpdateProfileModal>
            </Modal>
        </>
    );
};

export default AccountDetails;