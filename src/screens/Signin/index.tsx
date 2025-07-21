import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../hooks/useAuthentication';
import { useHandleSignInUserFlow } from '../../hooks/useHandleSignInUserFlow';

import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

import UsernameInput from '../../components/UsernameInput';

import { getUser } from "../../repositories/api/getUser";
import useUserStore from "../../repositories/localStorage/useUserStore";
import { User } from '../../repositories/globalEntities/User';

import styles from '../../styles';

const SigninScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const { signIn } = useAuthentication();

    const setUser = useUserStore((state: any) => state.setUser);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignIn = async () => {
        try {
            const key = await signIn({ username, password });

            // TO DO: Handle the case when key is undefined 

            if (key === undefined) {
                return;
            }

            // Get user data

            const user: User | undefined = await getUser({ key });

            // Set local storage user

            setUser(user);

            useHandleSignInUserFlow({ navigation, user });
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Access</Text>

            <UsernameInput setUsername={setUsername} />

            <Input
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                style={styles.button}
                onPress={handleSignIn}
            >
                Sign in
            </Button>

            <Button
                style={styles.button}
                onPress={() => navigation.navigate('SignupNavigator', { screen: "SignupMain" })}
            >
                Go to sign up
            </Button>
        </Layout>
    );
};

export default SigninScreen;