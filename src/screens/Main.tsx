import React from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AuthenticationScreenProp } from '../nativeStackScreenProp/AuthenticationScreenProps';

const MainScreen = () => {
    const navigation = useNavigation<AuthenticationScreenProp['navigation']>();

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Main page</Text>

            <Button onPress={goBack} style={styles.button}>
                Go back
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
    button: {
        marginTop: 30,
        width: '80%',
    }
});

export default MainScreen;