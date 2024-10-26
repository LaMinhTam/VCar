import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, NativeEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Icon } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GET_CAR_BY_ID } from '../../store/car/action';
import { getContractByRequestId, getVehicleHandoverByContractId, lesseeApproveHandover, signContract } from '../../store/rental/handlers';
import { calculateDays, formatDate, formatPrice, getWalletBalance, handleMetaMaskSignature, handleUploadSignature, sendTransaction } from '../../utils';
import { RootState } from '../../store/configureStore';
import { IContractData, IRentalData, IVehicleHandoverResponseData } from '../../store/rental/types';
import { Flex, Toast, Button, Modal } from '@ant-design/react-native';
import {
    useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import ReturnVehicleHandover from '../../components/dialog/ReturnVehicleHandover';


const RentalDetail = () => {
    const route = useRoute();
    const { record } = route.params as { record: IRentalData };
    const [contract, setContract] = useState<IContractData>({} as IContractData);
    const [vehicleHandover, setVehicleHandover] = useState<IVehicleHandoverResponseData>({} as IVehicleHandoverResponseData);
    const dispatch = useDispatch();
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail } = useSelector((state: RootState) => state.car);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { car } = carDetail;
    const { me } = useSelector((state: RootState) => state.profile);
    const [visibleReturnedModal, setVisibleReturnedModal] = useState(false);
    const { open, isConnected, address, provider } = useWalletConnectModal();

    useEffect(() => {
        fetchRentalContractById(record?.id);
    }, [record?.id]);

    const fetchRentalContractById = async (id: string) => {
        const response = await getContractByRequestId(id);
        if (response?.success && response.data) {
            setContract(response.data);
        }
    };

    const handleApproveVehicleHandover = async () => {
        const key = Toast.loading({
            content: 'Processing...',
            duration: 0,
            mask: true
        });
        if (!isConnected) {
            Toast.remove(key);
            return open();
        } else {
            const result = await handleMetaMaskSignature(me?.id ?? '', provider);
            const {
                signature,
                msg,
                account
            } = result;
            if (signature) {
                const response = await lesseeApproveHandover({
                    signature,
                    message: msg,
                    address: account,
                    signature_url: "https://picsum.photos/200"
                }, vehicleHandover?.id);
                if (response?.success) {
                    Toast.remove(key);
                    Toast.success({
                        content: 'Approve vehicle handover successfully',
                        duration: 2,
                    });
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    return;
                } else {
                    Toast.remove(key);
                    Toast.fail('Approve vehicle handover failed');
                    return;
                }
            } else {
                Toast.remove(key);
                Toast.fail('Please sign with MetaMask');
            }
        }
    }

    useEffect(() => {
        async function fetchVehicleHandover() {
            const response = await getVehicleHandoverByContractId(contract?.id);
            if (response?.success) {
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
            }
        }
        fetchVehicleHandover();
    }, [contract?.id])

    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id]);

    const handleSignContract = async () => {
        const key = Toast.loading({
            content: 'Processing...',
            duration: 0,
            mask: true
        });
        if (!isConnected) {
            Toast.remove(key);
            return open();
        } else {
            const result = await handleMetaMaskSignature(me?.id ?? '', provider);
            const {
                signature,
                msg,
                account
            } = result;
            if (signature) {
                const balance = await getWalletBalance(account, provider);
                if (balance !== null && parseFloat(balance) < 0.05) {
                    Toast.remove(key);
                    return Toast.fail('Insufficient balance');
                } else {
                    const transactionResult = await sendTransaction(provider, process.env.VITE_VCAR_OWNER_METAMASK_ADDRESS ?? '', '0.05', address ?? '');
                    if (transactionResult?.success) {
                        const response = await signContract(contract?.id, {
                            signature: result?.signature,
                            message: result?.msg,
                            address: result?.account,
                            signature_url: "https://picsum.photos/200"
                        });
                        if (response?.success) {
                            Toast.remove(key);
                            Toast.success({
                                content: 'Sign contract successfully',
                                duration: 2,
                            });
                            const vnpay_url = response?.data;
                            navigation.navigate('PAYMENT_VNPAY', { url: vnpay_url });
                        } else {
                            Toast.remove(key);
                            Toast.fail('Sign contract failed');
                        }
                    } else {
                        Toast.remove(key);
                        Toast.fail(transactionResult?.message);
                    }
                }
            } else {
                Toast.remove(key);
                Toast.fail('Please sign with MetaMask');
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
                {/* Car Card */}
                <View>
                    <Image
                        source={{ uri: car?.image_url[0] ?? 'https://picsum.photos/200/300' }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />
                </View>
                <View className="p-4">
                    <Text className="text-lg font-bold text-text8">{car?.name}</Text>
                    <Text className="mt-2 text-sm text-text3">{car?.description}</Text>
                </View>
                <Divider />
                <View style={{ marginBottom: 8 }} className="p-4">
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>Created at: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.created_at)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>Rental start date: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.rental_start_date)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>Rental end date: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.rental_end_date)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>Location: </Text>
                        <Text style={{ color: '#666' }}>{record.vehicle_hand_over_location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>Status: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: record.status === 'APPROVED' ? 'green' : record.status === 'PENDING' ? 'orange' : 'red',
                            }}
                        >
                            {record.status}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>Car Status: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: vehicleHandover?.lessee_approved ? 'green' : 'orange',
                            }}
                        >
                            {vehicleHandover?.lessee_approved ? 'HANDOVER' : 'NOT HANDOVER'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>Rent Status: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: vehicleHandover?.status === 'RETURNED' ? 'green' : 'orange',
                            }}
                        >
                            {vehicleHandover?.status === 'RETURNED' ? 'COMPLETE' : 'INCOMPLETE'}
                        </Text>
                    </View>
                </View>
                <Divider />
                {/* Host Detail */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">HOST DETAIL</Text>
                    <View className="flex-row items-center mt-2">
                        <Avatar
                            rounded
                            source={{ uri: car?.owner.image_url ?? 'https://randomuser.me/api/portraits/men/85.jpg' }}
                            size="medium"
                        />
                        <View className="ml-4">
                            <Text className="text-sm font-bold text-gray-900">{car?.owner.display_name}</Text>
                            <Text className="text-xs text-gray-600">Ho Chi Minh, Viet Nam</Text>
                        </View>
                        <View className="ml-auto">
                            <Button type='ghost' className="text-lite bg-thirdly" onPress={() => { }} >Contact</Button>
                        </View>
                    </View>
                </View>
                <Divider />
                {/* Action */}
                <Flex direction='row' align='center' wrap='wrap' justify='start' style={{
                    padding: 16,
                    gap: 10
                }}>
                    {contract?.rental_status === 'SIGNED' && vehicleHandover?.id && <Button type="warning">View handover document</Button>}
                    {contract?.id && <Button type="warning">View Contract</Button>}
                    {contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'CREATED' && <Button type="primary" onPress={handleApproveVehicleHandover}>Approve handover</Button>}
                    {contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RENDING' && <Button type="primary" onPress={() => setVisibleReturnedModal(true)}>Return Vehicle</Button>}
                    {contract.rental_status === 'PENDING' && <Button type="primary" onPress={handleSignContract}>Sign Contract</Button>}
                    {contract.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNED' && <Button type="primary" >Review</Button>}
                </Flex>
            </ScrollView>

            <Modal
                title="Create return vehicle handover"
                visible={visibleReturnedModal}
                onClose={() => setVisibleReturnedModal(false)}
                popup
                animationType="slide-up"
            >
                <ReturnVehicleHandover
                    visible={visibleReturnedModal}
                    setVisible={setVisibleReturnedModal}
                    userId={me?.id}
                    handoverId={vehicleHandover?.id}
                    setVehicleHandover={setVehicleHandover}
                />
            </Modal>

            {/* Footer Section */}
            <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
                <Text className="text-lg font-bold text-semiPrimary">{formatPrice(car?.daily_rate * numberOfDays)} VNĐ</Text>
                {/* {contract.rental_status === 'PENDING' && <Button title="Sign Contract" type="solid" onPress={handleSignContract} />} */}
            </View>
        </SafeAreaView>
    );
};

export default RentalDetail;