import { NavigatorScreenParams } from '@react-navigation/native';

import { SignupScreensList } from './SignupScreensList';

export type ApplicationScreensList = {
    Signin: undefined;
    SignupNavigator: NavigatorScreenParams<SignupScreensList>;
    Main: undefined;
};