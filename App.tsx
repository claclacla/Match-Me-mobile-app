import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ApplicationScreensList } from './src/screensList/ApplicationScreensList';

import SplashScreen from './src/screens/SplashScreen';
import IntroductionCarousel from './src/screens/IntroductionCarousel';
import InitScreen from './src/screens/InitScreen';
import SigninSignupNavigator from './src/screens/SigninSignup/Navigator';

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import OnboardingNavigator from './src/screens/Onboarding/Navigator';

Amplify.configure(awsconfig);

const Stack = createStackNavigator<ApplicationScreensList>();

// Custom theme to allow background colors to show through
const customTheme = {
    ...eva.light,
    'background-basic-color-1': 'transparent',
    'background-basic-color-2': 'transparent',
    'background-basic-color-3': 'transparent',
    'background-basic-color-4': 'transparent',
};

export default function App(): React.ReactElement {
    return (
        <ApplicationProvider {...eva} theme={customTheme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"SplashScreen"}>
                    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="IntroductionCarousel" component={IntroductionCarousel} options={{ headerShown: false }} />
                    <Stack.Screen name="Init" component={InitScreen} options={{ headerShown: false }} />
                    <Stack.Screen 
                        name="SigninSignupNavigator" 
                        component={SigninSignupNavigator} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen name="OnboardingNavigator" component={OnboardingNavigator} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    );
}