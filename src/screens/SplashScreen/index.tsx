import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

// Logo image from Figma
const logoIcon = "http://localhost:3845/assets/cf7c85bd8d7e7b45cd589c173146b1d4187ab8b6.png";

export default function SplashScreen() {
    const navigation = useNavigation<ApplicationNavigationProp>();

    useEffect(() => {
        // Show splash screen for 2 seconds, then navigate to Init
        const timer = setTimeout(() => {
            navigation.replace("Init");
        }, 2000);

        return () => clearTimeout(timer);
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
