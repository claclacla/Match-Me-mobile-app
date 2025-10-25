import { NavigatorScreenParams } from '@react-navigation/native';

import { SigninSignupScreensList } from './SigninSignupScreensList';
import { OnboardingScreensList } from './OnboardingScreensList';

export type ApplicationScreensList = {
    SplashScreen: undefined,
    IntroductionCarousel: undefined,
    Init: undefined,
    SigninSignupNavigator: NavigatorScreenParams<SigninSignupScreensList>;
    OnboardingNavigator: NavigatorScreenParams<OnboardingScreensList>;
};