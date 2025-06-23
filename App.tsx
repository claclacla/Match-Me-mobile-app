import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ApplicationScreensList } from './src/screensList/ApplicationScreensList';

import InitScreen from './src/screens/InitScreen';
import SigninScreen from './src/screens/Signin';
import SignupNavigator from './src/screens/Signup/Navigator';
import OnboardingScreen from './src/screens/Onboarding';

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import MainNavigator from './src/screens/Main/Navigator';

Amplify.configure(awsconfig);

const Stack = createStackNavigator<ApplicationScreensList>();

export default function App(): React.ReactElement {
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"Init"}>
                    <Stack.Screen name="Init" component={InitScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SignupNavigator" component={SignupNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="MainNavigator" component={MainNavigator} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
});