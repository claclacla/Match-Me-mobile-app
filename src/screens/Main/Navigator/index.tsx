import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatScreen from "../Chat";
import MatchStatusScreen from "../MatchStatus";
import ProfileScreen from "../Profile";

const Tab = createBottomTabNavigator();

const MainNavigator = () => (
    <Tab.Navigator initialRouteName={"Profile"}>
        <Tab.Screen name="Match" component={MatchStatusScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

export default MainNavigator;