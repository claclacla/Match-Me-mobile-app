import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

import { useAuthentication } from '../../hooks/useAuthentication';
import { useHandleSignInUserFlow } from '../../hooks/useHandleSignInUserFlow';

import { User } from '../../repositories/globalEntities/User';
import { getUser } from '../../repositories/api/getUser';
import useUserStore from "../../repositories/localStorage/useUserStore";

export default function InitScreen() {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const setUser = useUserStore((state: any) => state.setUser);

    const { getIdTokenIfSignedIn } = useAuthentication();

    useEffect(() => {
        console.log("Checking login...");
        try {
            const checkLogin = async () => {
                const key = await getIdTokenIfSignedIn();

                if (key === undefined) {
                    navigation.replace("Signin");
                    return;
                }

                // Get user data

                const user: User | undefined = await getUser({ key });

                // Set local storage user

                setUser(user);

                useHandleSignInUserFlow({ navigation, user });
            };

            checkLogin();
        } catch (error: any) {
            console.error('Error:', error);
        }
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}