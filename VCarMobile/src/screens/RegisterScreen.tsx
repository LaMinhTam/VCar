import React from 'react';
import { TextInput, Button } from 'react-native-paper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';

const RegisterScreen = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const handleRegister = () => {
        navigation.navigate('VERIFY_CODE_SCREEN');
    };

    return (
        <LayoutAuthentication
            title={t('auth.register.title')}
            desc={t('auth.register.desc')}
            type='REGISTER'
        >
            <TextInput
                label={t('auth.register.name')}
                mode="outlined"
                className="w-full mb-4"
            />
            <TextInput
                label={t('auth.register.email')}
                mode="outlined"
                className="w-full mb-4"
                keyboardType="email-address"
            />
            <TextInput
                label={t('auth.register.password')}
                mode="outlined"
                className="w-full mb-6"
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-outline" : "eye-off-outline"} onPress={() => setShowPassword(!showPassword)} />}
                outlineStyle={{ borderRadius: 10 }}
            />
            <Button
                mode="contained"
                className="w-full mb-4"
                onPress={handleRegister}
            >
                {t('auth.register')}
            </Button>
        </LayoutAuthentication>
    );
};

export default RegisterScreen;
