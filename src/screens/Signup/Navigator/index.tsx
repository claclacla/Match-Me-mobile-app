import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignupScreensList } from '../../../screensList/SignupScreensList';

import SignupMainScreen from '../Main';

const Stack = createStackNavigator<SignupScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"SignupMain"}>
            <Stack.Screen name="SignupMain" component={SignupMainScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;