import React from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { MainScreenNavigationProp } from '../nativeStackNavigationProp/MainScreenNavigationProp';

const AuthenticationScreen = () => {
    const navigation = useNavigation<MainScreenNavigationProp>();

    const goToMain = () => {
        navigation.navigate('Main');
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Welcome to Match Me!</Text>

            <Button onPress={goToMain} style={styles.button}>
                Log in
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
    },
    title: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        width: '80%',
    },
    text: {
        marginTop: 30,
    }
});

export default AuthenticationScreen;