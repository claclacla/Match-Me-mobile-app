import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingScreensList } from '../../../screensList/OnboardingScreensList';

import OnboardingPersonalInformationScreen from '../PersonalInformation';
import OnboardingSendScreen from '../Send';

const Stack = createStackNavigator<OnboardingScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"OnboardingPersonalInformation"}>
            <Stack.Screen name="OnboardingPersonalInformation" component={OnboardingPersonalInformationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingSend" component={OnboardingSendScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;