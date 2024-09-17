import { useMemo, useState } from 'react';
import { axiosPrivate } from '../apis/axios';
import { Spin, Typography } from 'antd';
import { toast } from 'react-toastify';

const PaymentCallBackPage = () => {
    const [loading, setLoading] = useState(true);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    useMemo(() => {
        const url = window.location.href;
        const [, queryString] = url.split('?');
        async function confirmPayment() {
            try {
                const response = await axiosPrivate.post(`/rental-contracts/payment-callback?${queryString}`);
                const { code } = response.data;
                if (code === 200) {
                    setIsPaymentSuccess(true);
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
    }, []);

    return (
        <div>
            {loading ? (
                <div className='flex items-center justify-center'><Spin size="large"></Spin></div>
            ) : (
                <div>
                    <p>Thanh toán {isPaymentSuccess ? 'thành công' : 'thất bại'}</p>
                    <Typography.Link href='/'>Về trang chủ</Typography.Link>
                </div>
            )}
        </div>
    );
};

export default PaymentCallBackPage;