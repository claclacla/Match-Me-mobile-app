import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignupScreensList } from '../../../screensList/SignupScreensList';

import SignupMainScreen from '../Main';
import SignupConfirmationScreen from '../Confirmation';

const Stack = createStackNavigator<SignupScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"SignupMain"}>
            <Stack.Screen name="SignupMain" component={SignupMainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignupConfirmation" component={SignupConfirmationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;