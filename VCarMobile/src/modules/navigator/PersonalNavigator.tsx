import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonalScreen from '../../screens/PersonalScreen';
import { ScreenOptions } from '../../constants';
import MyTrip from '../profile/MyTrip';
import RentalDetail from '../profile/RentalDetail';
import Payment from '../profile/Payment';

const Stack = createNativeStackNavigator();

const PersonalNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PERSONAL_SCREEN"
                component={PersonalScreen}
                options={{ ...ScreenOptions.personal, }}
            />
            <Stack.Screen
                name="MY_TRIP"
                component={MyTrip}
                options={{
                    title: 'My Trip',
                }}
            />
            <Stack.Screen
                name="RENTAL_DETAIL"
                component={RentalDetail}
                options={{
                    title: 'Rental Detail',
                }}
            />
            <Stack.Screen
                name="PAYMENT_VNPAY"
                component={Payment}
                options={{ ...ScreenOptions.personal, }}
            />

        </Stack.Navigator>
    )
}

export default PersonalNavigator