import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [showPassword, setShowPassword] = React.useState(false);
    const { t } = useTranslation();
    const handleLogin = () => {
        navigation.navigate('HOME_SCREEN');
    }
    return (
        <LayoutAuthentication
            title={t('auth.login.title')}
            desc={t('auth.login.desc')}
            type='LOGIN'
        >
            <TextInput
                label={t('auth.login.email')}
                mode="outlined"
                className="w-full mb-4"
                keyboardType="email-address"
                outlineStyle={{ borderRadius: 10 }}
            />

            <TextInput
                label={t('auth.login.password')}
                mode="outlined"
                className="w-full mb-6"
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-outline" : "eye-off-outline"} onPress={() => setShowPassword(!showPassword)} />}
                outlineStyle={{ borderRadius: 10 }}
            />

            <View className="flex-row items-center justify-end w-full mr-2">
                <Pressable>
                    <Text className="mb-6 text-sm text-text2">{t('auth.login.forgot_password')}</Text>
                </Pressable>
            </View>
            <Button mode="contained" className="w-full mb-4" onPress={handleLogin}>
                {t('auth.login')}
            </Button>
        </LayoutAuthentication>
    );
};

export default LoginScreen;
