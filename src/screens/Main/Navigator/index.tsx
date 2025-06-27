import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatScreen from "../Chat";
import MatchStatusScreen from "../MatchStatus";
import ProfileScreen from "../Profile";

const Tab = createBottomTabNavigator();

const MainNavigator = () => (
    <Tab.Navigator
        initialRouteName={"MainProfile"}
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap; 

                if (route.name === 'MainMatch') {
                    iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'MainChat') {
                    iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                } else if (route.name === 'MainProfile') {
                    iconName = focused ? 'person' : 'person-outline';
                } else {
                    iconName = 'help-circle-outline'; 
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false
        })}>
        <Tab.Screen name="MainMatch" component={MatchStatusScreen} options={{ tabBarLabel: 'Match' }} />
        <Tab.Screen name="MainChat" component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
        <Tab.Screen name="MainProfile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
);

export default MainNavigator;