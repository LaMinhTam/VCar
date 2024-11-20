import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import LayoutMain from '../layouts/LayoutMain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_ME } from '../store/profile/action';
import { removeTokens } from '../utils/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { getWalletBalance } from '../utils';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import ProfileCard from '../modules/profile/ProfileCard';
import ProfileCardSkeleton from '../components/common/ProfileCardSkeleton';
import { setIsReCheckToken } from '../store/auth/reducers';

const PersonalScreen = () => {
    const dispatch = useDispatch();
    const { me, loading } = useSelector((state: RootState) => state.profile);
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [balance, setBalance] = useState(0);
    const { open, isConnected, address, provider } = useWalletConnectModal();

    const handleLogout = async () => {
        await removeTokens();
        dispatch(setIsReCheckToken(!isRecheckToken));
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
    return (
        <LayoutMain>
            <Text className="mb-4 text-2xl font-bold text-text8">Profile</Text>

            {/* Thẻ Profile */}
            {loading ? <ProfileCardSkeleton /> : <ProfileCard
                me={me}
                balance={balance}
            />}

            {/* Danh sách chức năng */}
            <View className="space-y-4">
                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="account-circle" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Account Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200" onPress={() => navigation.navigate("MY_CARS", { refetchCars: true })}>
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

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="perm-identity" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Update metamask wallet</Text>
                </TouchableOpacity>
            </View>

            {/* Nút Logout */}
            <View className='fixed bottom-[-30px] left-0 right-0'>
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
                    onPress={handleLogout}
                />
            </View>
        </LayoutMain>
    );
};

export default PersonalScreen;