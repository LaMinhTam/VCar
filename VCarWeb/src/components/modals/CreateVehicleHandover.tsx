import { useState } from 'react';
import { Col, DatePicker, Row, Form, Input, Select, Button, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CreateVehicleHandover = () => {
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [collateral, setCollateral] = useState<{ type: string; details: string }[]>([
        { type: 'Xe máy', details: 'Biển số: 123123, Hiệu: Honda' },
        { type: 'Tiền mặt', details: '1 vnđ' },
    ]);

    const addDamage = () => {
        if (damageInput.trim()) {
            setDamages([...damages, damageInput]);
            setDamageInput('');
        }
    };

    const removeDamage = (index: number) => {
        setDamages(damages.filter((_, i) => i !== index));
    };

    const addCollateral = () => {
        setCollateral([...collateral, { type: '', details: '' }]);
    };

    const removeCollateral = (index: number) => {
        setCollateral(collateral.filter((_, i) => i !== index));
    };

    return (
        <Form layout="vertical">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Form.Item label="Thời gian bàn giao">
                        <RangePicker showTime className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Tình trạng xe">
                        <Select className="w-full">
                            <Option value="normal">Bình thường</Option>
                            <Option value="damage">Hư hỏng</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Số km đã đi">
                        <Input type="number" placeholder="Nhập số km đã đi" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Thiệt hại" className="overflow-auto max-h-32">
                        <Space direction="horizontal" wrap className="w-full">
                            {damages.map((damage, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeDamage(index)}
                                    className="flex items-center justify-between"
                                    color='#f50'
                                >
                                    {damage}
                                </Tag>
                            ))}
                        </Space>
                        <Space direction="horizontal" className="w-full mt-2">
                            <Input
                                value={damageInput}
                                onChange={(e) => setDamageInput(e.target.value)}
                                placeholder="Nhập thiệt hại"
                                className="w-full"
                            />
                            <Button type="dashed" onClick={addDamage} icon={<PlusOutlined />}>
                                Thêm thiệt hại
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Đồ dùng cá nhân">
                        <Input placeholder="Nhập đồ dùng cá nhân" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Tài sản thế chấp">
                        <Space direction="vertical" className="w-full">
                            {collateral.map((item, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeCollateral(index)}
                                    className="flex items-center justify-between"
                                >
                                    <Input
                                        value={item.type}
                                        onChange={(e) => {
                                            const newCollateral = [...collateral];
                                            newCollateral[index].type = e.target.value;
                                            setCollateral(newCollateral);
                                        }}
                                        placeholder="Loại tài sản"
                                        className="w-full"
                                    />
                                    <Input
                                        value={item.details}
                                        onChange={(e) => {
                                            const newCollateral = [...collateral];
                                            newCollateral[index].details = e.target.value;
                                            setCollateral(newCollateral);
                                        }}
                                        placeholder="Chi tiết tài sản"
                                        className="w-full"
                                    />
                                </Tag>
                            ))}
                            <Button type="dashed" onClick={addCollateral} icon={<PlusOutlined />}>
                                Thêm tài sản thế chấp
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateVehicleHandover;