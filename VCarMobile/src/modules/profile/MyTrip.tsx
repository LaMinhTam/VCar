import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Switch, TouchableOpacity } from 'react-native';
import { Chip, Divider } from 'react-native-elements';
import LayoutMain from '../../layouts/LayoutMain';
import dayjs from 'dayjs';
import { formatDate } from '../../utils';
import { Button, Card } from '@ant-design/react-native';
import { IRentalData, IRentalRequestParams } from '../../store/rental/types';
import RentRequestCard from './RentRequestCard';
import { useDispatch, useSelector } from 'react-redux';
import { GET_LESSEE_REQUESTS } from '../../store/rental/action';
import { RootState } from '../../store/configureStore';

const MyTrip = () => {
    const [selectedStatus, setSelectedStatus] = useState<'APPROVED' | 'REJECTED' | 'PENDING'>('APPROVED');
    const [sortDescending, setSortDescending] = useState(true);
    const { lesseeListRequest, loading } = useSelector((state: RootState) => state.rental);
    const dispatch = useDispatch();
    const [params, setParams] = useState<IRentalRequestParams>({
        sortDescending: "true",
        page: "0",
        size: "10",
        status: "APPROVED",
    });

    useMemo(() => {
        dispatch({ type: GET_LESSEE_REQUESTS, payload: params });
    }, [dispatch, params]);

    const handleStatusChange = (status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
        setSelectedStatus(status);
        setParams(prevParams => ({
            ...prevParams,
            status: status,
            page: "0",
        }));
    };

    const handleSortChange = (value: boolean) => {
        setSortDescending(value);
        setParams(prevParams => ({
            ...prevParams,
            sortDescending: value ? "true" : "false",
            page: "0",
        }));
    };

    const handleLoadMore = () => {
        if (lesseeListRequest.meta.has_next_page) {
            setParams(prevParams => ({
                ...prevParams,
                size: (parseInt(prevParams.size) + 5).toString(),
            }));
        }
    };

    const renderItem = ({ item }: { item: IRentalData }) => (
        <RentRequestCard item={item} />
    );

    return (
        <View>
            <View className="p-4">
                <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginBottom: 16 }}>
                    {/* Status Chips */}
                    <View style={{ flexDirection: 'row', marginRight: 16 }}>
                        <Chip
                            title="APPROVED"
                            type={selectedStatus === 'APPROVED' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('APPROVED')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title="PENDING"
                            type={selectedStatus === 'PENDING' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('PENDING')}
                            buttonStyle={{ marginRight: 8 }}
                        />
                        <Chip
                            title="REJECTED"
                            type={selectedStatus === 'REJECTED' ? 'solid' : 'outline'}
                            onPress={() => handleStatusChange('REJECTED')}
                        />
                    </View>

                    {/* Sort Switch */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 8, color: '#4a4a4a' }}>Sort Descending</Text>
                        <Switch
                            value={sortDescending}
                            onValueChange={handleSortChange}
                        />
                    </View>
                </View>

                <FlatList
                    data={lesseeListRequest?.data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <Text>Loading...</Text> : null}
                />
            </View>
        </View>
    );
};

export default MyTrip;