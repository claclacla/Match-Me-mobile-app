import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

// Logo image from Figma
const logoIcon = "http://localhost:3845/assets/cf7c85bd8d7e7b45cd589c173146b1d4187ab8b6.png";

export default function SplashScreen() {
    const navigation = useNavigation<ApplicationNavigationProp>();

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasSeenIntroduction = await AsyncStorage.getItem('hasSeenIntroduction');
                
                // Show splash screen for 2 seconds, then navigate based on first launch
                setTimeout(() => {
                    if (hasSeenIntroduction === 'true') {
                        navigation.replace("Init");
                    } else {
                        navigation.replace("IntroductionCarousel");
                    }
                }, 2000);
            } catch (error) {
                console.error('Error checking first launch:', error);
                // Default to showing introduction on error
                setTimeout(() => {
                    navigation.replace("IntroductionCarousel");
                }, 2000);
            }
        };

        checkFirstLaunch();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={{ uri: logoIcon }} 
                        style={styles.logoIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.title}>BREAKICE</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5f1', // Background color from Figma
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 155,
        height: 155,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcon: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontFamily: 'Rubik-Bold',
        fontSize: 40,
        fontWeight: '700',
        color: '#e23d3d', // Red color from Figma
        letterSpacing: 12.4,
        textAlign: 'center',
    },
});
