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

export default function HomeScreen() {
    const dispatch = useDispatch();
    const { cars } = useSelector((state: RootState) => state.car);
    const [carParams, setCarParams] = useState(QuerySearchCar);
    useEffect(() => {
        dispatch({ type: GET_CARS, payload: carParams })
    }, [carParams])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={{ flex: 1, padding: 16 }}>
                {/* Header Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Your location</Text>
                            <Icon name="chevron-down" size={16} color="black" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ho Chi Minh City, VN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 100 }}>
                        <Icon name="search-outline" size={28} color="black" />
                        <Icon name="notifications-outline" size={28} color="black" />
                        <Icon name="globe-outline" size={28} color="black" />
                    </View>
                </View>

                {/* Promo Section */}
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

            </ScrollView>
        </SafeAreaView>
    );
}
