import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';
import SigninSignupMainScreen from '../Main';
import SigninSignupConfirmationScreen from '../Confirmation';

const Stack = createStackNavigator<SigninSignupScreensList>();

export default function SigninSignupNavigator() {
    return (
        <Stack.Navigator initialRouteName="SigninSignupMain">
            <Stack.Screen 
                name="SigninSignupMain" 
                component={SigninSignupMainScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupConfirmation" 
                component={SigninSignupConfirmationScreen} 
                options={{ 
                    headerShown: false,
                    cardStyle: { backgroundColor: '#FAF5F1' }
                }} 
            />
        </Stack.Navigator>
    );
}
