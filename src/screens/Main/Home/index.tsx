import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Text } from '@ui-kitten/components';

const MainHomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAF5F1" />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Breakice!</Text>
                <Text style={styles.subtitle}>You've successfully completed the quiz and joined the community.</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default MainHomeScreen;
