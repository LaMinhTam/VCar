import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, NativeEventEmitter, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Icon } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GET_CAR_BY_ID } from '../../store/car/action';
import { approveRentRequest, getContractByRequestId, getRentRequestById, getVehicleHandoverByContractId, lesseeApproveHandover, lessorApproveReturn, postHandoverIssue, rejectRentRequest, signContract } from '../../store/rental/handlers';
import { calculateDays, formatDate, formatPrice, getWalletBalance, handleMetaMaskSignature, handleUploadSignature, sendTransaction } from '../../utils';
import { RootState } from '../../store/configureStore';
import { IContractData, IRentalData, IVehicleHandoverResponseData } from '../../store/rental/types';
import { Flex, Toast, Button, Modal } from '@ant-design/react-native';
import {
    useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import ReturnVehicleHandover from '../../components/dialog/ReturnVehicleHandover';
import { useTranslation } from 'react-i18next';
import CreateVehicleHandover from '../../components/dialog/CreateVehicleHandover';
import CreateReviewDialog from '../../components/dialog/CreateReviewDialog';
import RenderHTML from 'react-native-render-html';


const RentalDetail = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const [triggerRefetch, setTriggerRefetch] = useState(false);
    const [handoverIssue, setHandoverIssue] = useState('');
    const { requestId, type } = route.params as { requestId: string, type: string };
    const { width } = useWindowDimensions();
    const [record, setRecord] = useState<IRentalData>({} as IRentalData);
    const [contract, setContract] = useState<IContractData>({} as IContractData);
    const [vehicleHandover, setVehicleHandover] = useState<IVehicleHandoverResponseData>({} as IVehicleHandoverResponseData);
    const dispatch = useDispatch();
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail } = useSelector((state: RootState) => state.car);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { me } = useSelector((state: RootState) => state.profile);
    const [visibleReturnedModal, setVisibleReturnedModal] = useState(false);
    const [visibleCreateVehicleHandoverModal, setVisibleCreateVehicleHandoverModal] = useState(false);
    const [visibleReviewModal, setVisibleReviewModal] = useState(false);
    const { open, isConnected, address, provider } = useWalletConnectModal();

    useEffect(() => {
        fetchRentalRequestById();
    }, [requestId, triggerRefetch]);

    const fetchRentalRequestById = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await getRentRequestById(requestId);
        if (response?.success) {
            Toast.remove(key);
            setRecord(response.data as IRentalData);
        } else {
            Toast.remove(key);
            return;
        }
    }

    useEffect(() => {
        fetchRentalContractById(record?.id);
    }, [record?.id, triggerRefetch]);

    const fetchRentalContractById = async (id: string) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await getContractByRequestId(id);
        if (response?.success && response.data) {
            Toast.remove(key);
            setHandoverIssue(response?.data?.handover_issue ?? 'UNDEFINED');
            setContract(response.data);
        } else {
            Toast.remove(key);
            return;
        }
    };

    const handleRejectRentRequest = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const response = await rejectRentRequest(record.id);
        if (response?.success) {
            Toast.remove(key);
            Toast.success(t("msg.REQUEST_REJECTED"), 1);
            setTriggerRefetch(!triggerRefetch);
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.REJECT_REQUEST_FAILED"), 1);
        }
    };

    const handleApproveRentRequest = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const signatureResult = await handleMetaMaskSignature(me?.id ?? '', provider);
        if (!signatureResult) {
            Toast.fail(t("msg.METAMASK_SIGNATURE_FAILED"), 1);
            Toast.remove(key);
            return;
        }
        const { account, signature, msg } = signatureResult;
        if (signature) {
            const response = await approveRentRequest(record.id, {
                address: account,
                signature,
                message: msg,
                signature_url: "https://picsum.photos/200",
            });
            if (response?.success) {
                Toast.remove(key);
                setTriggerRefetch(!triggerRefetch);
                Toast.success(t("msg.REQUEST_APPROVED"), 1);
            } else {
                Toast.remove(key);
                Toast.fail(t("msg.APPROVE_REQUEST_FAILED"), 1);
            }
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.METAMASK_SIGNATURE_FAILED"), 1);
        }
    };

    const handleApproveVehicleHandover = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
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

    const handleApproveReturn = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const signatureResult = await handleMetaMaskSignature(me?.id ?? '', provider);
        if (!signatureResult) {
            Toast.remove(key);
            Toast.fail(t("msg.METAMASK_SIGNATURE_FAILED"), 1);
            return;
        }
        const { account, signature, msg } = signatureResult;
        if (signature) {
            const response = await lessorApproveReturn({
                signature,
                message: msg,
                address: account,
                signature_url: "https://picsum.photos/200"
            }, vehicleHandover?.id);
            if (response?.success) {
                Toast.success(t("msg.APPROVE_HANDOVER_SUCCESS"), 1);
                Toast.remove(key);
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                return;
            } else {
                Toast.fail(t("msg.APPROVE_HANDOVER_FAILED"), 1);
                Toast.remove(key);
                return;
            }
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.METAMASK_SIGNATURE_FAILED"), 1);
        }
    }

    useEffect(() => {
        async function fetchVehicleHandover() {
            const key = Toast.loading({
                content: t('common.processing'),
                duration: 0,
                mask: true
            });
            const response = await getVehicleHandoverByContractId(contract?.id);
            if (response?.success) {
                Toast.remove(key);
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
            } else {
                Toast.remove(key);
            }
        }
        fetchVehicleHandover();
    }, [contract?.id])

    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id]);

    const handleSignContract = async () => {
        const key = Toast.loading({
            content: t('common.processing'),
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

    const handleReportReturnedIssue = async (isApproved: boolean) => {
        const key = Toast.loading({
            content: t('common.processing'),
            duration: 0,
            mask: true
        });
        const approveCode = isApproved ? 'ISSUE' : 'NOT_ISSUE';
        const response = await postHandoverIssue(contract.id, approveCode);
        if (response?.success) {
            if (isApproved) {
                Toast.remove(key);
                Toast.success(t("msg.POST_HANDOVER_ISSUE"), 1);
                setTriggerRefetch(!triggerRefetch);
                setHandoverIssue(approveCode)
            } else {
                Toast.remove(key);
                Toast.success(t("msg.POST_HANDOVER_NOT_ISSUE"), 1);
            }
        } else {
            Toast.remove(key);
            Toast.fail(t("msg.REPORT_ISSUE_FAIL"), 1);
        }
    }

    if (!carDetail?.car || !record) return <Text>{t("common.empty")}</Text>
    const { car } = carDetail;

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
                    {/* <Text className="mt-2 text-sm text-text3">{car?.description}</Text> */}
                    <RenderHTML contentWidth={width} source={{ html: car?.description }} />
                </View>
                <Divider />
                <View style={{ marginBottom: 8 }} className="p-4">
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>{t("account.my_lessee.created_at")}: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.created_at)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>Rental start date: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.rental_start_date)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>{t("account.my_lessee.rental_end_date")}: </Text>
                        <Text style={{ fontWeight: '500' }}>{formatDate(record.rental_end_date)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ color: '#888' }}>{t("common.location")}: </Text>
                        <Text style={{ color: '#666' }}>{record.vehicle_hand_over_location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>{t("account.my_lessee.status")}: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: record.status === 'APPROVED' ? 'green' : record.status === 'PENDING' ? 'orange' : 'red',
                                textTransform: 'uppercase',
                            }}
                        >
                            {t(`common.${record.status}`)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>{t("common.carStatus")}: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: vehicleHandover?.lessee_approved ? 'green' : 'orange',
                                textTransform: 'uppercase',
                            }}
                        >
                            {vehicleHandover?.lessee_approved ? t(`common.HANDOVER`) : t(`common.NOT_HANDOVER`)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#888' }}>{t("common.carRentalStatus")}: </Text>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: vehicleHandover?.status === 'RETURNED' ? 'green' : 'orange',
                                textTransform: 'uppercase',
                            }}
                        >
                            {vehicleHandover?.status === 'RETURNED' ? t("common.COMPLETE") : t("common.INCOMPLETE")}
                        </Text>
                    </View>
                </View>
                <Divider />
                {/* Host Detail */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">{t("common.carOwner")}</Text>
                    <View className="flex-row items-center mt-2">
                        <Avatar
                            rounded
                            source={{ uri: car?.owner?.image_url ?? 'https://randomuser.me/api/portraits/men/85.jpg' }}
                            size="medium"
                        />
                        <View className="ml-4">
                            <Text className="text-sm font-bold text-gray-900">{car?.owner?.display_name}</Text>
                            <Text className="text-xs text-gray-600">Ho Chi Minh, Viet Nam</Text>
                        </View>
                        {/* <View className="ml-auto">
                            <Button type='ghost' className="text-lite bg-thirdly" onPress={() => { }} >Contact</Button>
                        </View> */}
                    </View>
                </View>
                <Divider />
                {/* Action */}
                <Flex direction='row' align='center' wrap='wrap' justify='start' style={{
                    padding: 16,
                    gap: 10
                }}>
                    {/* BOTH */}
                    {contract?.rental_status === 'SIGNED' && vehicleHandover?.id && <Button type="warning">{t("account.rent_contract.view_handover")}</Button>}
                    {contract?.id && <Button type="warning">{t("account.rent_contract.view_contract")}</Button>}

                    {/* LESSEE */}
                    {type === 'LESSEE' && contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'CREATED' && <Button type="primary" onPress={handleApproveVehicleHandover}>{t("account.rent_contract.approve_handover")}</Button>}
                    {type === 'LESSEE' && contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RENDING' && <Button type="primary" onPress={() => setVisibleReturnedModal(true)}>{t("account.rent_contract.return_vehicle")}</Button>}
                    {type === 'LESSEE' && contract.rental_status === 'PENDING' && <Button type="primary" onPress={handleSignContract}>{t("account.rent_contract.sign_contract")}</Button>}
                    {type === 'LESSEE' && contract.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNED' && <Button type="primary" onPress={() => setVisibleReviewModal(true)}>{t("account.rent_contract.review")}</Button>}

                    {/* LESSOR */}
                    {type === 'LESSOR' && record.status === 'PENDING' && (<>
                        <Button type="warning" onPress={handleRejectRentRequest}>{t("common.REJECT")}</Button>
                        <Button type="primary" onPress={handleApproveRentRequest}>{t("common.APPROVE")}</Button>
                    </>)}
                    {type === 'LESSOR' && contract?.rental_status === 'SIGNED' && !vehicleHandover?.id && <Button type="primary" onPress={() => setVisibleCreateVehicleHandoverModal(true)}>{t("account.rental_contract.create_handover")}</Button>}
                    {type === 'LESSOR' && contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNING' && <Button type="primary" onPress={handleApproveReturn}>{t("account.rental_contract.approve_returned")}</Button>}
                    {type === 'LESSOR' && contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNED' && <Button type="primary" disabled={handoverIssue !== 'UNDEFINED'} onPress={() => handleReportReturnedIssue(false)}>{t("account.rental_contract.return_not_issue")}</Button>}
                    {type === 'LESSOR' && contract?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNED' && <Button type="primary" disabled={handoverIssue !== 'UNDEFINED'} onPress={() => handleReportReturnedIssue(true)}>{t("account.rental_contract.report_issue")}</Button>}
                </Flex>
            </ScrollView>

            <Modal
                title={t("account.rent_contract.create_return_vehicle_handover")}
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
            <Modal
                title={t("account.rental_contract.create_handover")}
                visible={visibleCreateVehicleHandoverModal}
                onClose={() => setVisibleCreateVehicleHandoverModal(false)}
                popup
                animationType="slide-up"
            >
                <CreateVehicleHandover
                    visible={visibleCreateVehicleHandoverModal}
                    setVisible={setVisibleCreateVehicleHandoverModal}
                    userId={me?.id}
                    contractId={contract?.id}
                    setVehicleHandover={setVehicleHandover}
                />
            </Modal>
            <Modal
                title={t("account.rental_contract.create_handover")}
                visible={visibleReviewModal}
                onClose={() => setVisibleReviewModal(false)}
                popup
                animationType="slide-up"
            >
                <CreateReviewDialog visible={visibleReviewModal} setVisible={setVisibleReviewModal} contract_id={contract.id} />
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