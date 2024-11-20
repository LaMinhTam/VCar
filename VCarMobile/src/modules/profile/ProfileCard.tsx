import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Flex, Toast } from '@ant-design/react-native';
import { DEFAULT_AVATAR } from '../../constants';
import { IUser } from '../../store/profile/types';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { buyToken } from '../../store/profile/handlers';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

const ProfileCard = ({ me, balance }: {
    me: IUser,
    balance: number
}) => {
    const { t } = useTranslation();
    const { open, isConnected } = useWalletConnectModal();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const handleDepositTokens = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        if (!isConnected) {
            Toast.remove(key);
            await open();
        } else {
            const response = await buyToken();
            if (response?.success) {
                const vnpayUrl = response?.data
                if (vnpayUrl) {
                    Toast.remove(key);
                    navigation.navigate('PAYMENT_VNPAY', { url: vnpayUrl });
                }
            } else {
                Toast.remove(key);
                Toast.fail('Deposit token failed');
            }
        }
    }
    return (
        <View className="flex-row items-center p-4 mb-6 bg-blue-500 rounded-xl">
            <Flex direction='row'>
                <Image
                    source={{ uri: DEFAULT_AVATAR }}
                    className="object-contain w-12 h-12 mr-4 rounded-full"
                />
                <View>
                    <Text className="font-bold text-white">{me?.display_name}</Text>
                    <Text className="text-white">{me?.phone_number}</Text>
                    <Text className='text-white'>Balance: {Number(balance).toFixed(2)}</Text>
                </View>
                <Button
                    type='outline'
                    title={`Deposit`}
                    buttonStyle={{
                        paddingVertical: 12,
                        backgroundColor: '#FFF',
                        borderRadius: 30,
                        marginLeft: 10,
                    }}
                    titleStyle={{
                        color: '#103F74',
                        fontWeight: 'bold',
                    }}
                    onPress={handleDepositTokens}
                />
            </Flex>
        </View>
    )
}

export default ProfileCard