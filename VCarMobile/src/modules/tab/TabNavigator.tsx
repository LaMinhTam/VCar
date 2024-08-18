import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import CarScreen from '../../screens/CarScreen';
import { ScreenOptions } from '../../constants';
import ConversationScreen from '../../screens/ConversationScreen';
import PersonalScreen from '../../screens/PersonalScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="HOME_SCREEN"
                component={HomeScreen}
                options={{
                    ...ScreenOptions.home,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="home"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
            />
            <Tab.Screen
                name="CAR_SCREEN"
                component={CarScreen}
                options={{
                    ...ScreenOptions.car,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="car"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
            />
            <Tab.Screen
                name="CONVERSATION_SCREEN"
                component={ConversationScreen}
                options={{
                    ...ScreenOptions.conversation,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="chatbox"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
            />
            <Tab.Screen
                name="PERSONAL_SCREEN"
                component={PersonalScreen}
                options={{
                    ...ScreenOptions.personal,
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="person"
                            size={24}
                            color={focused ? 'blue' : 'black'}
                        />
                    ),
                    tabBarLabel: '',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;