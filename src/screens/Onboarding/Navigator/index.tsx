import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreensList } from '../../../screensList/OnboardingScreensList';

import OnboardingForkScreen from '../OnboardingFork';
import HowItWorksScreen from '../HowItWorks';
import InsightsQuizScreen from '../InsightsQuiz';

const Stack = createStackNavigator<OnboardingScreensList>();

const OnboardingNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OnboardingFork">
            <Stack.Screen 
                name="OnboardingFork" 
                component={OnboardingForkScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="HowItWorks" 
                component={HowItWorksScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="InsightsQuiz" 
                component={InsightsQuizScreen} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
};

export default OnboardingNavigator;
