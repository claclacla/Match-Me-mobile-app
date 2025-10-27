import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainScreensList } from '../../../screensList/MainScreensList';
import MainHomeScreen from '../Home';

const Stack = createStackNavigator<MainScreensList>();

const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="MainHome" component={MainHomeScreen} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
