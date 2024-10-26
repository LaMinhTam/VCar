import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import LayoutMain from '../layouts/LayoutMain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_ME } from '../store/profile/action';
import { removeTokens } from '../utils/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { setIsRecheckToken } from '../store/auth/reducers';
import { DEFAULT_AVATAR } from '../constants';
import { getWalletBalance } from '../utils';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { Flex, Toast } from '@ant-design/react-native';
import { buyToken } from '../store/profile/handlers';

const PersonalScreen = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state: RootState) => state.profile);
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [balance, setBalance] = useState(0);
    const { open, isConnected, address, provider } = useWalletConnectModal();

    const handleLogout = async () => {
        await removeTokens();
        dispatch(setIsRecheckToken(!isRecheckToken));
        if (isConnected) {
            await provider?.disconnect();
        }
    }

    useEffect(() => {
        dispatch({ type: GET_ME })
    }, [])

    async function fetchWalletBalance() {
        if (!isConnected) {
            await open();
        } else {
            const balance = await getWalletBalance(address ?? '', provider);
            console.log("fetchWalletBalance ~ balance2:", balance)
            setBalance(parseFloat(balance || '0'));
        }
    }

    useEffect(() => {
        fetchWalletBalance();
    }, [isConnected, address])

    useFocusEffect(
        useCallback(() => {
            fetchWalletBalance();
        }, [fetchWalletBalance])
    );

    const handleDepositTokens = async () => {
        const key = Toast.loading({
            content: 'Processing...',
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
        <LayoutMain>
            <Text className="mt-10 mb-4 text-2xl font-bold text-text8">Profile</Text>

            {/* Thẻ Profile */}
            <View className="flex-row items-center p-4 mb-6 bg-blue-500 rounded-xl">
                <Flex direction='row'>
                    <Image
                        source={{ uri: DEFAULT_AVATAR }}
                        className="object-contain w-12 h-12 mr-4 rounded-full"
                    />
                    <View>
                        <Text className="font-bold text-white">{me.display_name}</Text>
                        <Text className="text-white">{me.email}</Text>
                        <Text className='text-white'>Balance: {balance}</Text>
                    </View>
                    <Button
                        type='solid'
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

            {/* Danh sách chức năng */}
            <View className="space-y-4">
                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="account-circle" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Account Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="drive-eta" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">My Cars</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("MY_TRIP")}>
                    <Icon name="tour" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">My Trip</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="accessibility" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">My Lessee</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="lock" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="drive-eta" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Update license</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="perm-identity" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Update citizen identification</Text>
                </TouchableOpacity>

                <Button
                    title="Logout"
                    buttonStyle={{
                        backgroundColor: '#103F74',
                        borderRadius: 30,
                        paddingVertical: 12,
                    }}
                    titleStyle={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }}
                    containerStyle={{
                        marginTop: 180,
                    }}
                    onPress={handleLogout}
                />
            </View>

            {/* Nút Logout */}
        </LayoutMain>
    );
};

export default PersonalScreen;