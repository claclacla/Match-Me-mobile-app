import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingScreensList } from '../../../screensList/OnboardingScreensList';

import OnboardingPersonalInformationScreen from '../PersonalInformation';
import OnboardingUploadAvatarScreen from '../UploadAvatar';
import OnboardingInsightsCoverScreen from '../InsightsCover';
import OnboardingInsightsScreen from '../Insights';
import OnboardingInsightsSummaryScreen from '../InsightsSummary';
import OnboardingSendScreen from '../Send';

const Stack = createStackNavigator<OnboardingScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"OnboardingPersonalInformation"}>
            <Stack.Screen name="OnboardingPersonalInformation" component={OnboardingPersonalInformationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingUploadAvatar" component={OnboardingUploadAvatarScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingInsightsCover" component={OnboardingInsightsCoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingInsights" component={OnboardingInsightsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingInsightsSummary" component={OnboardingInsightsSummaryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingSend" component={OnboardingSendScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;