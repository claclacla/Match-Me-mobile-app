import React, { useState, useMemo } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import UsernameInput from '../../../components/UsernameInput';

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

    // Form validation
    const isFormValid = useMemo(() => {
        return (
            username.trim() !== '' &&
            password.trim() !== '' &&
            password.length >= 6 // Minimum password length
        );
    }, [username, password]);

    const handleSignUp = async () => {
        if (!isFormValid) {
            return;
        }

        try {
            await signUp({ username: username.trim(), password: password.trim() });
            navigation.navigate('SignupConfirmation', { username });
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Sign up</Text>

            <UsernameInput setUsername={setUsername} />

            <Input
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                status={password !== '' && password.length < 6 ? 'danger' : 'basic'}
                caption={password !== '' && password.length < 6 ? 'Password must be at least 6 characters' : ''}
            />

            <Button
                style={isFormValid ? styles.button : styles.buttonDisabled}
                onPress={handleSignUp}
                disabled={!isFormValid}
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