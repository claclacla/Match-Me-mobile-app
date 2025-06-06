import React, { useEffect, useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthenticationScreen from './src/screens/Authentication';
import MainScreen from './src/screens/Main';

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { getCurrentUser } from '@aws-amplify/auth';

Amplify.configure(awsconfig);

const Stack = createNativeStackNavigator();

export default function App(): React.ReactElement {
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

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={isSignedIn ? "Main" : "Authentication"}>
                    <Stack.Screen name="Authentication" component={AuthenticationScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
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