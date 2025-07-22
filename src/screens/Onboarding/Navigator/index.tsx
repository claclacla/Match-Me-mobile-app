import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingScreensList } from '../../../screensList/OnboardingScreensList';

import OnboardingPersonalInformationScreen from '../PersonalInformation';
import OnboardingUploadAvatarScreen from '../UploadAvatar';
import OnboardingGroupBehaviorInsightsCoverScreen from '../GroupBehaviorInsightsCover';
import OnboardingGroupBehaviorInsightsScreen from '../GroupBehaviorInsights';
import OnboardingGroupBehaviorInsightsSummaryScreen from '../GroupBehaviorInsightsSummary';
import OnboardingGroupPersonalExperienceScreen from '../GroupPersonalExperience';
import OnboardingCompleteScreen from '../Complete';

const Stack = createStackNavigator<OnboardingScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"OnboardingPersonalInformation"}>
            <Stack.Screen name="OnboardingPersonalInformation" component={OnboardingPersonalInformationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingUploadAvatar" component={OnboardingUploadAvatarScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsightsCover" component={OnboardingGroupBehaviorInsightsCoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsights" component={OnboardingGroupBehaviorInsightsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsightsSummary" component={OnboardingGroupBehaviorInsightsSummaryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupPersonalExperience" component={OnboardingGroupPersonalExperienceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;