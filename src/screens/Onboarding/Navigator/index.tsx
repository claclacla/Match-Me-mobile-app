import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingScreensList } from '../../../screensList/OnboardingScreensList';

import OnboardingCoverScreen from '../Cover';

import OnboardingPersonalInformationScreen from '../PersonalInformation';
import OnboardingLocationScreen from '../Location';
import OnboardingUploadAvatarScreen from '../UploadAvatar';

import OnboardingGroupPersonalExperienceCoverScreen from '../GroupPersonalExperienceCover';
import OnboardingGroupPersonalExperienceIntroScreen from '../GroupPersonalExperienceIntro';
import OnboardingGroupPersonalExperienceRecordingScreen from '../GroupPersonalExperienceRecording';
import OnboardingGroupPersonalExperienceThankYouScreen from '../GroupPersonalExperienceThankYou';

import OnboardingGroupBehaviorInsightsCoverScreen from '../GroupBehaviorInsightsCover';
import OnboardingGroupBehaviorInsightsIntroScreen from '../GroupBehaviorInsightsIntro';
import OnboardingGroupBehaviorInsightsQuestionsScreen from '../GroupBehaviorInsightsQuestions';
import OnboardingGroupBehaviorInsightsThankYouScreen from '../GroupBehaviorInsightsThankYou';

const Stack = createStackNavigator<OnboardingScreensList>();

function SignupNavigator() {
    return (
        <Stack.Navigator initialRouteName={"OnboardingCover"}>
            <Stack.Screen name="OnboardingCover" component={OnboardingCoverScreen} options={{ headerShown: false }} />

            <Stack.Screen name="OnboardingPersonalInformation" component={OnboardingPersonalInformationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingLocation" component={OnboardingLocationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingUploadAvatar" component={OnboardingUploadAvatarScreen} options={{ headerShown: false }} />

            <Stack.Screen name="OnboardingGroupPersonalExperienceCover" component={OnboardingGroupPersonalExperienceCoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupPersonalExperienceIntro" component={OnboardingGroupPersonalExperienceIntroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupPersonalExperienceRecording" component={OnboardingGroupPersonalExperienceRecordingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupPersonalExperienceThankYou" component={OnboardingGroupPersonalExperienceThankYouScreen} options={{ headerShown: false }} />

            <Stack.Screen name="OnboardingGroupBehaviorInsightsCover" component={OnboardingGroupBehaviorInsightsCoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsightsIntro" component={OnboardingGroupBehaviorInsightsIntroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsightsQuestions" component={OnboardingGroupBehaviorInsightsQuestionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingGroupBehaviorInsightsThankYou" component={OnboardingGroupBehaviorInsightsThankYouScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SignupNavigator;