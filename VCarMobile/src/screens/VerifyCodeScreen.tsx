import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const VerifyCodeScreen = () => {
    const [code, setCode] = useState('');
    const navigation = useNavigation(); // Initialize navigation

    // Handler for verifying the code
    const handleVerifyCode = () => {
        // Perform code verification here

        // Navigate to the next screen upon successful verification
        // navigation.navigate('NextScreen'); // Change 'NextScreen' to your next screen name
    };

    return (
        <KeyboardAwareScrollView
            className="flex flex-1 bg-strock"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={100}
            enableAutomaticScroll
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <View className="items-center justify-center flex-1 px-6">
                <Text className="mb-8 text-3xl font-bold text-text8">
                    Verify Your Email
                </Text>
                <TextInput
                    label="Verification Code"
                    mode="outlined"
                    className="w-full mb-6"
                    keyboardType="numeric"
                    value={code}
                    onChangeText={setCode}
                />
                <Button
                    mode="contained"
                    className="w-full mb-4"
                    onPress={handleVerifyCode} // Verify code button handler
                >
                    Verify Code
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default VerifyCodeScreen;
