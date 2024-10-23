import { View } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, ParamListBase } from '@react-navigation/native';
import { axiosPrivate } from '../../apis/axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from '@ant-design/react-native';

const Payment = () => {
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { url } = route.params as { url: string };

    const onNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        // Kiểm tra nếu URL là return_url
        if (url.startsWith('http://localhost:5173/payment_callback')) {
            // Tách tham số từ URL
            const params = url.split('?')[1];
            await axiosPrivate.post(`/rental-contracts/payment-callback?${params}`);
            Toast.success('Thanh toán thành công', 1);
            navigation.navigate('MY_TRIP');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: url }}
                style={{ marginTop: 20 }}
                onNavigationStateChange={onNavigationStateChange}
            />
        </View>
    );
}

export default Payment;
