import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { ScreenOptions } from './constants';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './store/configureStore';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen name='WELCOME_SCREEN' component={WelcomeScreen} options={ScreenOptions.welcome}></Stack.Screen> */}
            <Stack.Screen name='LOGIN_SCREEN' component={LoginScreen} options={ScreenOptions.login}></Stack.Screen>
            <Stack.Screen name='REGISTER_SCREEN' component={RegisterScreen} options={ScreenOptions.register}></Stack.Screen>
            <Stack.Screen name='VERIFY_CODE_SCREEN' component={VerifyCodeScreen}></Stack.Screen>
            <Stack.Screen name="HOME_SCREEN" component={HomeScreen} options={ScreenOptions.home} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
}