import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../hooks/useAuthentication';
import { useHandleSignInUserFlow } from '../../hooks/useHandleSignInUserFlow';

import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../styles';

const SigninScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const { signIn } = useAuthentication();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignIn = async () => {
        try {
            const key = await signIn({ username, password });

            // TO DO: Handle the case when key is undefined 

            if (key === undefined) {
                return;
            }

            useHandleSignInUserFlow({ navigation, key });
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Access Match Me!</Text>

            <Input
                style={styles.input}
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
            />
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