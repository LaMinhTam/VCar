import { EditOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Modal, Row, Typography } from 'antd';
import ImageUploader from '../../../components/common/ImageUploader';
import { getUserInfoFromCookie } from '../../../utils';
import UpdateProfileModal from '../../../components/modals/UpdateProfileModal';
import { useState } from 'react';

const ProfileCard = ({
    refetchMe,
    setRefetchMe
}: {
    refetchMe: boolean;
    setRefetchMe: (value: boolean) => void;
}) => {
    const userInfo = getUserInfoFromCookie();
    const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
    return (
        <>
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
                                    <Typography.Text>{userInfo?.car_license?.dob}</Typography.Text>
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
                                    <Typography.Text>{userInfo?.phone_number}</Typography.Text>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Modal title="Cập nhật thông tin cá nhân" footer={false} open={openUpdateProfileModal} onCancel={() => setOpenUpdateProfileModal(false)}>
                <UpdateProfileModal refetchMe={refetchMe} setRefetchMe={setRefetchMe} setOpenUpdateProfileModal={setOpenUpdateProfileModal}></UpdateProfileModal>
            </Modal>
        </>
    );
};

export default ProfileCard;