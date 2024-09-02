import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { ICar } from '../../store/car/types';
import { formatPrice } from '../../utils';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
                    <Card key={car.id} containerStyle={{ width: 200, padding: 0, borderRadius: 10, marginRight: 10 }}>
                        <Card.Image
                            source={{ uri: car.image_url[0] ?? 'https://picsum.photos/200/300' }}
                            style={{ height: 120 }}
                            resizeMode="cover"
                            onPress={() => navigation.navigate('CAR_DETAIL_SCREEN', { carId: car.id })}
                        />
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: 'bold' }} className='w-full h-5 line-clamp-2'>{car.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Icon name="star" size={16} color="#FFD700" />
                                <Text style={{ marginLeft: 5 }}>{car.average_rating} (124 review)</Text>
                            </View>
                            <Text style={{ marginTop: 5, fontWeight: 'bold' }}><Text className='font-bold text-semiPrimary'>{formatPrice(car.daily_rate)} VNĐ</Text> / day</Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </>

    )
}

export default VehicleSection