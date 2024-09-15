import { useEffect, useState } from 'react';
import { axiosPrivate } from '../apis/axios';
import { Typography } from 'antd';
import { toast } from 'react-toastify';

const PaymentCallBackPage = () => {
    const [loading, setLoading] = useState(true);
    const url = window.location.href;
    const [queryString] = url.split('?');

    useEffect(() => {
        async function confirmPayment() {
            try {
                const response = await axiosPrivate.post(`/rental-contracts/payment-callback?${queryString}`);
                const { code } = response.data;
                if (code === 200) {
                    toast.success('Thanh toán thành công');
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                toast.error('Thanh toán thất bại');
                console.log(error);
            }
        }
        if (queryString) {
            confirmPayment();
        }
    }, [queryString]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p>Thanh toán thành công</p>
                    <Typography.Link href='/'>Về trang chủ</Typography.Link>
                </div>
            )}
        </div>
    );
};

export default PaymentCallBackPage;