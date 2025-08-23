import { NavigatorScreenParams } from '@react-navigation/native';

import { SignupScreensList } from './SignupScreensList';
import { OnboardingScreensList } from './OnboardingScreensList';
import { MatcherScreensList } from './MatcherScreensList';
import { MainScreensList } from './MainScreensList';

export type ApplicationScreensList = {
    Init: undefined,
    Signin: undefined;
    SignupNavigator: NavigatorScreenParams<SignupScreensList>;
    OnboardingNavigator: NavigatorScreenParams<OnboardingScreensList>;
    MatcherNavigator: NavigatorScreenParams<MatcherScreensList>;
    MainNavigator: NavigatorScreenParams<MainScreensList>;
};