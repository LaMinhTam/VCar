import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { DEFAULT_AVATAR } from '../constants';

const PersonalScreen = () => {
    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16
        }}>
            <View className="flex-row items-center p-4 mb-5 bg-blue-500 rounded-lg">
                <Image
                    source={{ uri: DEFAULT_AVATAR }}
                    className="w-16 h-16 mr-4 rounded-full"
                />
                <View>
                    <Text className="text-lg font-semibold text-white">Rekt Gustian</Text>
                    <Text className="text-sm text-gray-300">#PIK12897</Text>
                </View>
            </View>
            <ListItem containerStyle={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0'
            }}>
                <ListItem.Content>
                    <ListItem.Title className="text-base text-gray-800">Account Profile</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0'
            }}>
                <ListItem.Content>
                    <ListItem.Title className="text-base text-gray-800">Billing</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0'
            }}>
                <ListItem.Content>
                    <ListItem.Title className="text-base text-gray-800">Change Password</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0'
            }}>
                <ListItem.Content>
                    <ListItem.Title className="text-base text-gray-800">Notification</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <Button
                title="Logout"

            />
        </ScrollView>
    )
}

export default PersonalScreen