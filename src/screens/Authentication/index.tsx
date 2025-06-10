import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { MainScreenNavigationProp } from '../../nativeStackNavigationProp/MainScreenNavigationProp';

import { useAuthentication } from './hooks/useAuthentication';

const AuthenticationScreen = () => {
    const navigation = useNavigation<MainScreenNavigationProp>();

    const { signUp, confirmSignUp, signIn, signOut } = useAuthentication();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [confirmationCode, setConfirmationCode] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp({ username, password });
            //navigation.navigate('Main');
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    const handleConfirmationCode = async () => {
        try {
            await confirmSignUp({ username, confirmationCode });
        } catch (error: any) {

        }
    };

    const handleSignIn = async () => {
        try {
            await signIn({ username, password });
            navigation.navigate('Main');
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
                placeholder='Nome Utente'
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

            <Input
                style={styles.input}
                placeholder='Confirmation code'
                value={confirmationCode}
                onChangeText={setConfirmationCode}
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
                onPress={handleConfirmationCode}
            >
                Send confirmation code
            </Button>

            <Button
                style={styles.button}
                onPress={handleSignIn}
            >
                Sign in
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    title: {
        marginBottom: 30,
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        marginTop: 10,
    },
    ghostButton: {
        marginTop: 10,
    }
});

export default AuthenticationScreen;