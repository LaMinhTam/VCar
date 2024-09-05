import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_CARS } from '../store/car/action';
import { QuerySearchCar } from '../store/car/models';
import PromoSection from '../modules/home/PromoSection';
import VehicleSection from '../modules/home/VehicleSection';
import LayoutMain from '../layouts/LayoutMain';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const { cars } = useSelector((state: RootState) => state.car);
    const [carParams, setCarParams] = useState(QuerySearchCar);
    useEffect(() => {
        dispatch({ type: GET_CARS, payload: carParams })
    }, [carParams])
    return (
        <LayoutMain>
            <PromoSection />

            <VehicleSection
                title="Top vehicle"
                cars={cars}
            />

            <VehicleSection
                title="Vehicle for you"
                cars={cars}
            />

            <VehicleSection
                title="Vehicle near you"
                cars={cars}
            />
        </LayoutMain>
    );
}
