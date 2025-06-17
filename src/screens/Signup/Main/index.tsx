import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ApplicationScreensList } from '../../../screensList/ApplicationScreensList';
import { SignupScreensList } from '../../../screensList/SignupScreensList';

import { useAuthentication } from '../../../hooks/useAuthentication';

import styles from '../../../styles';

type SignupMainScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<SignupScreensList, 'SignupMain'>,
    StackNavigationProp<ApplicationScreensList>
>;

const SignupMainScreen = () => {
    const navigation = useNavigation<SignupMainScreenNavigationProp>();

    const { signUp } = useAuthentication();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignUp = async () => {
        try {
            await signUp({ username, password });
            navigation.navigate('SignupConfirmation', { username });
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Sign up</Text>

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
                onPress={handleSignUp}
            >
                Sign up
            </Button>

            <Button
                style={styles.button}
                onPress={() => navigation.navigate('Signin')}
            >
                Go to sign in
            </Button>
        </Layout>
    );
};

export default SignupMainScreen;