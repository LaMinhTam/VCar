import { useMemo, useState } from "react";
import { formatPrice, getUserInfoFromCookie } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { GET_CAR_BY_ID } from "../store/car/action";
import { Button, Checkbox, Col, DatePicker, Divider, Image, Input, Radio, RadioChangeEvent, Rate, Row, Spin, Typography } from "antd";
import { DEFAULT_AVATAR } from "../config/apiConfig";
import LocationSelect from "../components/common/LocationSelect";
import { SecurityScanOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

const CheckoutPage = () => {
    const carId = localStorage.getItem('STORAGE_RENT_CAR_ID');
    const userInfo = getUserInfoFromCookie();
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("VNPAY");

    const onChange = (e: RadioChangeEvent) => {
        setPaymentMethod(e.target.value);
    };

    useMemo(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: carId });
    }, [carId, dispatch])

    return (
        <div>
            {!loading && car?.id && <div>
                <Row>
                    <Col span={16}>
                        <Row gutter={[0, 32]}>
                            <Col span={24}>
                                <div className="p-6 rounded-lg shadow-md bg-lite">
                                    <div className="flex items-center justify-between mb-8">
                                        <Typography.Title className="m-0" level={5}>
                                            Billing Info
                                        </Typography.Title>
                                        <Typography.Text className="text-sm text-custom-blue">Step 1 of 4</Typography.Text>
                                    </div>
                                    <Row gutter={[32, 24]}>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Name</Typography.Text>
                                            <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.display_name}></Input>
                                        </Col>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Phone Number</Typography.Text>
                                            <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.phone_number}></Input>
                                        </Col>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Mail</Typography.Text>
                                            <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.email}></Input>
                                        </Col>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Address</Typography.Text>
                                            <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={"12 District, Ho Chi Minh City"}></Input>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="p-6 rounded-lg shadow-md bg-lite">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <Typography.Title className="m-0" level={5}>
                                                Rental Info
                                            </Typography.Title>
                                            <Typography.Text className="text-sm text-custom-blue">Please select your rental date</Typography.Text>
                                        </div>
                                        <Typography.Text className="text-sm text-custom-blue">Step 2 of 4</Typography.Text>
                                    </div>
                                    <Row gutter={[32, 24]}>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Locations</Typography.Text>
                                            <LocationSelect className="w-full h-[56px] rounded-lg bg-grayf6 mt-4"></LocationSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Typography.Text className="font-medium">Rental Time</Typography.Text>
                                            <RangePicker showTime className="w-full h-[56px] rounded-lg bg-grayf6 mt-4"></RangePicker>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="p-6 rounded-lg shadow-md bg-lite">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <Typography.Title className="m-0" level={5}>
                                                Payment Method
                                            </Typography.Title>
                                            <Typography.Text className="text-sm text-custom-blue">Please select your payment method</Typography.Text>
                                        </div>
                                        <Typography.Text className="text-sm text-custom-blue">Step 3 of 4</Typography.Text>
                                    </div>
                                    <Row>
                                        <Radio.Group className="flex-1" onChange={onChange} value={paymentMethod}>
                                            <Col span={24} className="mb-6">
                                                <div className="flex items-center justify-between">
                                                    <Radio value={"VNPAY"} className="font-medium">VNPAY</Radio>
                                                    <Image preview={false} src="./vnpay.webp" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                                                </div>
                                            </Col>
                                            <Col span={24} className="mb-6">
                                                <div className="flex items-center justify-between">
                                                    <Radio value={"PAYPAL"} className="font-medium">PAYPAL</Radio>
                                                    <Image preview={false} src="./paypal.jpg" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div className="flex items-center justify-between">
                                                    <Radio value={"BITCOIN"} className="font-medium">BITCOIN</Radio>
                                                    <Image preview={false} src="./bitcoin.jpg" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                                                </div>
                                            </Col>
                                        </Radio.Group>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="p-6 rounded-lg shadow-md bg-lite">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <Typography.Title className="m-0" level={5}>
                                                Confirmation
                                            </Typography.Title>
                                            <Typography.Text className="text-sm text-custom-blue">We are getting to the end. Just few clicks and your rental is ready!</Typography.Text>
                                        </div>
                                        <Typography.Text className="text-sm text-custom-blue">Step 4 of 4</Typography.Text>
                                    </div>
                                    <Row gutter={[0, 24]}>
                                        <Col span={24}>
                                            <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                                                <Checkbox>I agree with sending an Marketing and newsletter emails. No spam, promissed!</Checkbox>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                                                <Checkbox>I agree with our terms and conditions and privacy policy.</Checkbox>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Button type="primary" className="mt-8">Rent Now</Button>
                                    <div className="mt-8">
                                        <SecurityScanOutlined className="mb-4 text-2xl" />
                                        <Typography.Title level={5}>All your data are safe</Typography.Title>
                                        <Typography.Text className="text-sm text-custom-blue">We are using the most advanced security to provide you the best experience ever.</Typography.Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div className="p-6 rounded-lg shadow-md bg-lite">
                            <Typography.Title level={5}>Rental Summary</Typography.Title>
                            <Typography.Paragraph className="text-sm text-custom-blue">Prices may change depending on the length of the rental and the price of your rental car.</Typography.Paragraph>
                            <Row justify={"center"} gutter={[16, 0]}>
                                <Col span={8}>
                                    <Image preview={false} src={car?.image_url[0] ?? DEFAULT_AVATAR} alt={car?.name} className="object-contain w-full h-full rounded-lg"></Image>
                                </Col>
                                <Col span={16}>
                                    <Typography.Title level={4}>{car?.name}</Typography.Title>
                                    <Row justify={"center"} align={"middle"}>
                                        <Col span={14}>
                                            <Rate disabled defaultValue={car?.average_rating} className="text-lg"></Rate>
                                        </Col>
                                        <Col span={10}>
                                            <Typography.Text className="text-sm font-normal">440+ Reviewer</Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Divider></Divider>
                            <div className="flex items-center justify-between">
                                <Typography.Text className="text-custom-blue">Subtotal</Typography.Text>
                                <Typography.Text>{formatPrice(car?.daily_rate)} VNĐ</Typography.Text>
                            </div>
                            <div className="flex items-center justify-between mt-6">
                                <Typography.Text className="text-custom-blue">Tax</Typography.Text>
                                <Typography.Text>0 VNĐ</Typography.Text>
                            </div>
                            <div className="w-full h-[56px] bg-grayf6 px-8 py-4 flex items-center justify-between rounded-lg my-8">
                                <Typography.Text className="text-sm text-custom-blue">Apply promo code</Typography.Text>
                                <Typography.Text className="text-sm font-medium cursor-pointer">Apply now</Typography.Text>
                            </div>
                            <Row>
                                <Col span={16}>
                                    <Typography.Title level={5}>Total Rental Price</Typography.Title>
                                    <Typography.Text className="text-sm text-custom-blue">Overall price and includes rental discount</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Title className="text-right" level={4}>{formatPrice(car?.daily_rate)} VNĐ</Typography.Title>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>}
            {loading && <div className='flex items-center justify-center'><Spin size="large"></Spin></div>}
        </div>
    );
};

export default CheckoutPage;