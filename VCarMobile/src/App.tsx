import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './store/configureStore';
import { getTokens } from './utils/auth';
import TabNavigator from './modules/tab/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [tokens, setTokens] = useState({
    accessToken: '',
    refreshToken: ''
  });

  useEffect(() => {
    const fetchTokens = async () => {
      const retrievedTokens = await getTokens();
      setTokens({
        accessToken: retrievedTokens?.accessToken || '',
        refreshToken: retrievedTokens?.refreshToken || ''
      });
    };

    fetchTokens();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          {tokens.accessToken ? (
            <TabNavigator />
          ) : (
            <Stack.Navigator>
              <Stack.Screen name='LOGIN_SCREEN' component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name='REGISTER_SCREEN' component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name='VERIFY_CODE_SCREEN' component={VerifyCodeScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
