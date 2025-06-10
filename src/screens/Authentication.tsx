import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { signIn, signOut, fetchAuthSession } from '@aws-amplify/auth';

import { MainScreenNavigationProp } from '../nativeStackNavigationProp/MainScreenNavigationProp';

import { findSimilarUsersById } from '../repositories/api/findSimilarUsersById';

const AuthenticationScreen = () => {
    const navigation = useNavigation<MainScreenNavigationProp>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            await signIn({
                username,
                password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });

            const session = await fetchAuthSession();

            
            const key = session.tokens?.idToken?.toString();

            if(key === undefined) {
                return;
            }
            
            console.log(key);

            const response: string = await findSimilarUsersById({ key });

            console.log(response);

            //navigation.navigate('Main');
        } catch (error: any) {
            let errorMessage = 'Error';

            if (error.name === 'UserNotFoundException') {
                errorMessage = 'Username not found!';
            } else if (error.name === 'NotAuthorizedException') {
                errorMessage = 'Username or password error!';
            } else if (error.name === 'UserNotConfirmedException') {
                errorMessage = 'User not confirmed. Check your email!';
            } else {
                errorMessage = error.message || errorMessage;
            }

            console.error('Error:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();

            //setUsername('');
            //setPassword('');
        } catch (error: any) {
            console.error('Sign out error:', error);
        }
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

            <Button
                style={styles.button}
                onPress={handleSignIn}
            >
                Accedi
            </Button>

            <Button
                appearance='outline'
                onPress={handleSignOut}
                style={styles.button}
                status='danger'
            >
                Disconnetti (Test)
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