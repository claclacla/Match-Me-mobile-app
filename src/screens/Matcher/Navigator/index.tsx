import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MatcherScreensList } from '../../../screensList/MatcherScreensList';
import MatcherAdventureSelectorScreen from '../AdventureSelector';
import MatcherPreferencesSelectorScreen from '../PreferencesSelector';

const Stack = createStackNavigator<MatcherScreensList>();

function MatcherNavigator() {
    return (
        <Stack.Navigator initialRouteName={"MatcherAdventureSelector"}>
            <Stack.Screen name="MatcherAdventureSelector" component={MatcherAdventureSelectorScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MatcherPreferencesSelector" component={MatcherPreferencesSelectorScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default MatcherNavigator;