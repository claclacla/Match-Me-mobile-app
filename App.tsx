import React, { useEffect, useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ApplicationScreensList } from './src/screensList/ApplicationScreensList';

import SigninScreen from './src/screens/Signin';
import SignupNavigator from './src/screens/Signup/Navigator';
import ProfileScreen from './src/screens/Profile';

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
//import { getCurrentUser } from '@aws-amplify/auth';

Amplify.configure(awsconfig);

const Stack = createStackNavigator<ApplicationScreensList>();

export default function App(): React.ReactElement {
    /*
    const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                await getCurrentUser();
                setIsSignedIn(true);
            } catch (error) {
                console.log(error);
                setIsSignedIn(false);
            }
        };

        checkAuthState();
    }, []);

    if (isSignedIn === null) {
        return (
            <ApplicationProvider {...eva} theme={eva.light}>
                <Layout style={styles.loadingContainer}>
                    <Text category='h1'>Loading...</Text>
                </Layout>
            </ApplicationProvider>
        );
    }
    */

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
                {/*<Stack.Navigator initialRouteName={isSignedIn ? "Main" : "Authentication"}>*/}
                <Stack.Navigator initialRouteName={"Signin"}>
                    <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SignupNavigator" component={SignupNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
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