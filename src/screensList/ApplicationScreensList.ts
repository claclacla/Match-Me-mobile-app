import { NavigatorScreenParams } from '@react-navigation/native';

import { SignupScreensList } from './SignupScreensList';
import { MainScreensList } from './MainScreensList';

export type ApplicationScreensList = {
    Init: undefined,
    Signin: undefined;
    SignupNavigator: NavigatorScreenParams<SignupScreensList>;
    Onboarding: undefined;
    MainNavigator: NavigatorScreenParams<MainScreensList>;
};