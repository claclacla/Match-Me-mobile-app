import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

// Assets
const logoImage = require('../../../../assets/images/logo.png');

const OnboardingForkScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleStartQuiz = () => {
        navigation.navigate('InsightsQuiz');
    };

    const handleLearnMore = () => {
        navigation.navigate('HowItWorks');
    };

    return (
        <SafeAreaView style={figmaStyles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            
            {/* Logo Header */}
            <View style={figmaStyles.logoHeader}>
                <View style={figmaStyles.logoIcon}>
                    <Image
                        source={logoImage}
                        style={figmaStyles.logoImage}
                    />
                </View>
                <Text style={figmaStyles.logoText}>BREAKICE</Text>
            </View>

            {/* Main Content */}
            <View style={figmaStyles.content}>
                <Text style={figmaStyles.title}>Find your group</Text>

                {/* First Card - Find your group */}
                <View style={figmaStyles.cardContainer}>
                    <View style={figmaStyles.card}>
                        <Text style={figmaStyles.cardTitle}>🎯 Find your group</Text>
                        <Text style={figmaStyles.cardDescription}>
                            Answer 5 quick choices. ~2 minutes. Improves your matching.
                        </Text>
                        <TouchableOpacity 
                            style={figmaStyles.cardButton}
                            onPress={handleStartQuiz}
                        >
                            <Text style={figmaStyles.cardButtonText}>Start the quiz →</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Second Card - How it works */}
                <View style={figmaStyles.cardContainer}>
                    <View style={figmaStyles.cardSecondary}>
                        <Text style={figmaStyles.cardTitle}>💡 How it works</Text>
                        <Text style={figmaStyles.cardDescription}>
                            Guidance and tips to get started.
                        </Text>
                        <TouchableOpacity 
                            style={figmaStyles.cardButton}
                            onPress={handleLearnMore}
                        >
                            <Text style={figmaStyles.cardButtonText}>Learn more →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const figmaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 41,
        marginBottom: 0,
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
        paddingTop: 20,
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
    cardContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#FDE8E8',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 250,
        justifyContent: 'space-between',
    },
    cardSecondary: {
        backgroundColor: 'rgba(131, 184, 215, 0.3)',
        borderRadius: 12,
        padding: 24,
        minHeight: 201,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontFamily: 'Rubik-SemiBold',
        fontSize: 22,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
    },
    cardDescription: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    cardButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    cardButtonText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 17,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingForkScreen;
