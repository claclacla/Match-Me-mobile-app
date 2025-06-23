import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';

import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { ApplicationScreensList } from '../../screensList/ApplicationScreensList';

import { useAuthentication } from '../../hooks/useAuthentication';

import styles from '../../styles';
import { getUser } from '../../repositories/api/getUser';

type SigninNavigationProp = StackNavigationProp<ApplicationScreensList, 'Signin'>;

const SigninScreen = () => {
    const navigation = useNavigation<SigninNavigationProp>();

    const { signIn, signOut } = useAuthentication();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignIn = async () => {
        try {
            const key = await signIn({ username, password });

            // TO DO: Handle the case when key is undefined 

            if(key === undefined) {
                return;
            }

            await getUser({ key });

            //navigation.replace('Onboarding');
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
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

            <Button
                appearance='outline'
                onPress={handleSignOut}
                style={styles.button}
                status='danger'
            >
                Sign out
            </Button>
        </Layout>
    );
};

export default SigninScreen;