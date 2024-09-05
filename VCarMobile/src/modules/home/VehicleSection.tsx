import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { ICar } from '../../store/car/types';
import { formatPrice } from '../../utils';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CarCard from '../../components/common/CarCard';

const VehicleSection = ({ title, cars }: {
    title: string
    cars: ICar[]
}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ color: '#1E90FF' }}>See all</Text>
            </View>
            <ScrollView className='mb-4' horizontal showsHorizontalScrollIndicator={false}>
                {cars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={car}
                    ></CarCard>
                ))}
            </ScrollView>
        </>

    )
}

export default VehicleSection