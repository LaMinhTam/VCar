import { Button, Card } from '@ant-design/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { formatDate } from '../../utils';
import { IRentalData } from '../../store/rental/types';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const RentRequestCard = ({ item }: {
    item: IRentalData
}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <Card style={{ margin: 8, borderRadius: 8 }}>
            <Card.Header
                title="Rental Details"
                style={{ borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                extra={
                    <Button
                        type="primary"
                        size="small"
                        onPress={() => navigation.navigate('RENTAL_DETAIL', { record: item })}
                    >
                        View
                    </Button>
                }
            />
            <Card.Body>
                <View style={{ padding: 12 }}>
                    <View style={{ marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#888' }}>Rental start date: </Text>
                            <Text style={{ fontWeight: '500' }}>{formatDate(item.rental_start_date)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#888' }}>Rental end date: </Text>
                            <Text style={{ fontWeight: '500' }}>{formatDate(item.rental_end_date)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#888' }}>Location: </Text>
                            <Text style={{ color: '#666' }}>{item.vehicle_hand_over_location}</Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 8 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#888' }}>Status: </Text>
                            <Text style={{ fontWeight: '500', color: item.status === 'APPROVED' ? 'green' : item.status === 'PENDING' ? 'orange' : 'red' }}>{item.status}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: '#888' }}>{formatDate(item.created_at)}</Text>
                        </View>
                    </View>
                </View>
            </Card.Body>
        </Card>
    );
};

export default RentRequestCard;