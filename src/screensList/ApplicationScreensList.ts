import { NavigatorScreenParams } from '@react-navigation/native';

import { SigninSignupScreensList } from './SigninSignupScreensList';
import { MatcherScreensList } from './MatcherScreensList';
import { MainScreensList } from './MainScreensList';

export type ApplicationScreensList = {
    SplashScreen: undefined,
    IntroductionCarousel: undefined,
    Init: undefined,
    SigninSignupNavigator: NavigatorScreenParams<SigninSignupScreensList>;
    MatcherNavigator: NavigatorScreenParams<MatcherScreensList>;
    MainNavigator: NavigatorScreenParams<MainScreensList>;
};