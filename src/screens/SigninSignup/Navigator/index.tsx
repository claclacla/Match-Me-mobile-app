import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';
import SigninSignupMainScreen from '../Main';
import SigninSignupConfirmationScreen from '../Confirmation';
import SigninSignupBasicInfoScreen from '../BasicInfo';
import SigninSignupPersonalDetailsScreen from '../PersonalDetails';
import SigninSignupLocationScreen from '../Location';
import SigninSignupUploadAvatarScreen from '../UploadAvatar';
import SigninSignupVoiceRecordingScreen from '../VoiceRecording';
import SigninSignupSignupOutroScreen from '../SignupOutro';

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
            <Stack.Screen 
                name="SigninSignupBasicInfo" 
                component={SigninSignupBasicInfoScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupPersonalDetails" 
                component={SigninSignupPersonalDetailsScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupLocation" 
                component={SigninSignupLocationScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupUploadAvatar" 
                component={SigninSignupUploadAvatarScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupVoiceRecording" 
                component={SigninSignupVoiceRecordingScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SigninSignupSignupOutro" 
                component={SigninSignupSignupOutroScreen} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
}
