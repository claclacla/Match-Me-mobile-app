import { NavigatorScreenParams } from '@react-navigation/native';

import { SigninSignupScreensList } from './SigninSignupScreensList';
import { OnboardingScreensList } from './OnboardingScreensList';
import { MatcherScreensList } from './MatcherScreensList';
import { MainScreensList } from './MainScreensList';

export type ApplicationScreensList = {
    Init: undefined,
    SigninSignupNavigator: NavigatorScreenParams<SigninSignupScreensList>;
    OnboardingNavigator: NavigatorScreenParams<OnboardingScreensList>;
    MatcherNavigator: NavigatorScreenParams<MatcherScreensList>;
    MainNavigator: NavigatorScreenParams<MainScreensList>;
};