import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';
import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

// Assets
const logoImage = require('../../../../assets/images/logo.png');

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupSignupOutro'>;
type AppNavigationProp = ApplicationNavigationProp;

const SignupOutroScreen = () => {
    const navigation = useNavigation<NavigationProp & AppNavigationProp>();

    const handleUnderstand = () => {
        navigation.replace('MatcherNavigator', { screen: 'MatcherAdventureSelector' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            
            {/* Logo Header */}
            <View style={styles.logoHeader}>
                <View style={styles.logoIcon}>
                    <Image 
                        source={logoImage}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.logoText}>BREAKICE</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Welcome!</Text>
                
                <View style={styles.textContainer}>
                    <Text style={styles.boldText}>Trust, safety, and respect are our baseline.</Text>
                    <Text style={styles.paragraph}>This is how we show up on Breakice.</Text>
                    
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. Be kind.</Text>
                        <Text style={styles.listItem}>2. Listen first.</Text>
                        <Text style={styles.listItem}>3. Be reliable.</Text>
                        <Text style={styles.listItem}>4. Report issues.</Text>
                    </View>
                    
                    <Text style={styles.paragraph}>Please uphold these values whenever you meet and chat.</Text>
                    
                    <Text style={styles.paragraph}>
                        We're excited to see the friendships you'll create.
                    </Text>
                    
                    <Text style={styles.paragraph}>
                        With love,{'\n'}
                        The Breakice Team
                    </Text>
                </View>

                {/* I Understand Button */}
                <TouchableOpacity
                    style={styles.understandButton}
                    onPress={handleUnderstand}
                >
                    <Text style={styles.understandButtonText}>I understand</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        height: 87,
        paddingRight: 16,
    },
    logoIcon: {
        width: 72,
        height: 72,
        marginRight: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    logoText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 26,
        fontWeight: '700',
        color: '#E23D3D',
        letterSpacing: 4.83,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 40,
        width: 346,
    },
    textContainer: {
        width: 302,
        marginBottom: 40,
    },
    boldText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        lineHeight: 24,
        marginBottom: 16,
    },
    paragraph: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        lineHeight: 24,
        marginBottom: 16,
    },
    listContainer: {
        marginVertical: 16,
    },
    listItem: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        lineHeight: 24,
        marginBottom: 8,
        marginLeft: 24,
    },
    understandButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        width: 286,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    understandButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default SignupOutroScreen;
