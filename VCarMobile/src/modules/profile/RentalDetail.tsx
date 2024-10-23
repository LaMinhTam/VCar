import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, Modal, StyleSheet, NativeEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Divider, Icon } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GET_CAR_BY_ID } from '../../store/car/action';
import { getContractByRequestId, getVehicleHandoverByContractId, signContract } from '../../store/rental/handlers';
import { calculateDays, formatDate, formatPrice, handleUploadSignature } from '../../utils';
import { RootState } from '../../store/configureStore';
import Signature from "react-native-signature-canvas"; // Import Signature
import { IContractData, IRentalData, IVehicleHandoverResponseData } from '../../store/rental/types';
import { Toast } from '@ant-design/react-native';

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

    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const signatureRef = useRef<any>(null);

    useEffect(() => {
        fetchRentalContractById(record?.id);
    }, [record?.id]);

    const fetchRentalContractById = async (id: string) => {
        const response = await getContractByRequestId(id);
        if (response?.success && response.data) {
            setContract(response.data);
        }
    };

    useEffect(() => {
        async function fetchVehicleHandover() {
            const response = await getVehicleHandoverByContractId(record?.id);
            if (response?.success) {
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
            }
        }
        fetchVehicleHandover();
    }, [record?.id])

    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id]);

    const handleSignature = (signature: string) => {
        setSignature(signature);
        setShowSignaturePad(false);
    };

    const handleSignContract = async () => {
        // if (!signature) {
        //     console.error("Signature is required");
        //     return;
        // }
        const key = Toast.loading({
            content: 'Processing...',
            duration: 0,
            mask: true
        });
        const response = await signContract(contract?.id, {
            signature: '0x0a0fd8e1e0bb419cf5295261ea0d955bf9330811e872279dee1ca09326c3afd62f1b617259ba3b4510e51817be8e936076cdea41c866933ea707f730d23e99031c',
            message: "Approve rental request for Thông",
            address: "0x33632615d410f91f356f4775346952596882a621",
            "signature_url": "https://picsum.photos/200"
        });
        if (response?.success) {
            Toast.remove(key);
            Toast.success({
                content: 'Sign contract successfully',
                duration: 2,
                onClose: () => {
                    setShowSignaturePad(false);
                }
            });
            const vnpay_url = response?.data;
            navigation.navigate('PAYMENT_VNPAY', { url: vnpay_url });
        } else {
            Toast.remove(key);
            Toast.fail('Sign contract failed');
        }
    }

    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clearSignature();
        } else {
            console.error("Signature reference is not set");
        }
    };

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
                            <Button title="Contact" type="outline" className="text-lite bg-thirdly" onPress={() => { }} />
                        </View>
                    </View>
                </View>
                <Divider />

                {/* Show signed signature */}
                {signature && (
                    <View className="p-4">
                        <Text className="text-xs font-bold text-gray-900">Signed Contract</Text>
                        <Image
                            source={{ uri: signature }}
                            style={{ width: '100%', height: 200, marginTop: 10 }}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </ScrollView>

            {/* Footer Section */}
            <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
                <Text className="text-lg font-bold text-semiPrimary">{formatPrice(car?.daily_rate * numberOfDays)} VNĐ</Text>
                {contract?.id && <Button title="Sign Contract" type="solid" onPress={handleSignContract} />}
            </View>

            {/* Signature Modal */}
            <Modal
                visible={showSignaturePad}
                animationType="slide"
                transparent
                onRequestClose={() => setShowSignaturePad(false)}
                collapsable={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.signatureBox}>
                        <Icon
                            name="close"
                            type="material"
                            color="#000"
                            containerStyle={styles.closeIcon}
                            onPress={() => setShowSignaturePad(false)}
                        />
                        <Signature
                            ref={signatureRef}
                            onOK={handleSignature}
                            webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
                            descriptionText="Sign here"
                            style={styles.signaturePad}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Clear" onPress={handleClear} />
                            {/* <Button title="Submit" onPress={() => signatureRef.current?.readSignature()} /> */}
                            <Button title="Submit" onPress={handleSignContract} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    signatureBox: {
        width: 300,
        height: 400,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    signaturePad: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
});

export default RentalDetail;