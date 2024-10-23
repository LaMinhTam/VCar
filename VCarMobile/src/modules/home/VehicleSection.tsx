import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { ICar, IQuerySearchCar } from '../../store/car/types';
import { formatPrice } from '../../utils';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CarCard from '../../components/common/CarCard';
import CardSkeleton from '../../components/common/CardSkeleton';
import { QuerySearchCar } from '../../store/car/models';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { GET_CARS } from '../../store/car/action';

const VehicleSection = ({ title, type }: {
    title: string
    type: string,
}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const dispatch = useDispatch();
    const { cars, loading } = useSelector((state: RootState) => state.car);
    const [carParams, setCarParams] = useState<IQuerySearchCar>({ ...QuerySearchCar });
    useEffect(() => {
        dispatch({ type: GET_CARS, payload: carParams })
    }, [carParams])
    useMemo(() => {
        switch (type) {
            case 'TOP':
                setCarParams({ ...QuerySearchCar, rating: '5', maxRate: '1000000' })
                break;
            case 'FOR_YOU':
                setCarParams({ ...QuerySearchCar, rating: '5' })
                break;
            case 'NEAR_YOU':
                setCarParams({ ...QuerySearchCar, province: 'Ho_Chi_Minh' })
                break;
            default:
                break;
        }
    }, [type])
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ color: '#1E90FF' }}>See all</Text>
            </View>
            <ScrollView className='mb-4' horizontal showsHorizontalScrollIndicator={false}>
                {!loading && cars.length > 0 && cars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={car}
                        isFullWidth={false}
                    ></CarCard>
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <CardSkeleton
                        key={index}
                        isFullWidth
                    ></CardSkeleton>
                ))}
            </ScrollView>
        </>

    )
}

export default VehicleSection