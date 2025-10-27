import { NavigatorScreenParams } from '@react-navigation/native';

import { SigninSignupScreensList } from './SigninSignupScreensList';
import { OnboardingScreensList } from './OnboardingScreensList';
import { MainScreensList } from './MainScreensList';

export type ApplicationScreensList = {
    SplashScreen: undefined,
    IntroductionCarousel: undefined,
    Init: undefined,
    SigninSignupNavigator: NavigatorScreenParams<SigninSignupScreensList>;
    OnboardingNavigator: NavigatorScreenParams<OnboardingScreensList>;
    MainNavigator: NavigatorScreenParams<MainScreensList>;
};