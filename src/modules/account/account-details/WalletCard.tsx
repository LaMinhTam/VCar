import { PlusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';

const WalletCard = ({ loading, handleDepositToken, handleCheckSyncWallet, metamaskInfo }: {
    loading: boolean,
    handleDepositToken: () => Promise<void>,
    handleCheckSyncWallet: () => Promise<void>
    metamaskInfo: {
        account: string,
        balance: string
    }
}) => {
    return (
        <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Flex gap={4}>
                            <Typography.Title level={3}>Ví của tôi</Typography.Title>
                        </Flex>
                        <Flex gap={4}>
                            <Button type="dashed" icon={<SyncOutlined />} loading={loading} onClick={handleCheckSyncWallet}>Kiểm tra đồng bộ</Button>
                            <Button type="primary" icon={<PlusCircleOutlined />} loading={loading} onClick={handleDepositToken}>Nạp token</Button>
                        </Flex>
                    </Flex>
                </Col>
                <Col span={24}>
                    <Flex align="center" justify="space-between">
                        <Typography.Text>Địa chỉ</Typography.Text>
                        <Typography.Text>{metamaskInfo?.account}</Typography.Text>
                    </Flex>
                    <Divider></Divider>
                    <Flex align="center" justify="space-between">
                        <Typography.Text>Số dư</Typography.Text>
                        <Typography.Text>{metamaskInfo?.balance}</Typography.Text>
                    </Flex>
                </Col>
            </Row>
        </Col>
    );
};

export default WalletCard;