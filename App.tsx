import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthenticationScreen from './src/screens/Authentication';
import MainScreen from './src/screens/Main';

const Stack = createNativeStackNavigator();

export default function App(): React.ReactElement {
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Authentication">
                    <Stack.Screen name="Authentication" component={AuthenticationScreen} options={{headerShown: false}} />
                    <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});