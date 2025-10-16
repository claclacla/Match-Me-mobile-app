import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, TextInput, StatusBar, Image } from 'react-native';
import { CompositeNavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';
import { ApplicationScreensList } from '../../../screensList/ApplicationScreensList';
import { useAuthentication } from '../../../hooks/useAuthentication';

// Assets
const img = "http://localhost:3845/assets/cf7c85bd8d7e7b45cd589c173146b1d4187ab8b6.png";

// Colors
const COLORS = {
    background: '#FAF5F1',
    red: '#e23d3d',
    black: '#191919',
    lightGray: '#818080',
    inputBackground: '#f3efed',
    textBlack: '#1c1c1c',
    white: '#ffffff',
    border: '#000000'
};

type NavigationProp = CompositeNavigationProp<StackNavigationProp<SigninSignupScreensList>, StackNavigationProp<ApplicationScreensList>>;
type RouteProp = StackScreenProps<SigninSignupScreensList, 'SigninSignupConfirmation'>['route'];

function SignupConfirmationScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const { confirmSignUp } = useAuthentication();
    const username = route.params?.username;

    const [confirmationCode, setConfirmationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown

    const isFormValid = useMemo(() => {
        return confirmationCode.trim().length === 6;
    }, [confirmationCode]);

    // Countdown timer for resend button
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleConfirmationCode = async () => {
        if (!isFormValid || isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            await confirmSignUp({ username, confirmationCode: confirmationCode.trim() });
            navigation.replace('SigninSignupMain');
        } catch (error: any) {
            console.error('Confirmation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = () => {
        if (resendTimer > 0) return;
        // TODO: Implement resend code logic
        setResendTimer(60); // Reset timer
    };

    const formatPhoneNumber = (phone: string) => {
        // Format phone number to show only last 4 digits
        if (phone && phone.length > 4) {
            const lastFour = phone.slice(-4);
            return `+39 *** *** ${lastFour}`;
        }
        return phone || '+39 *** *** 6789';
    };

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            
            {/* Background */}
            <View style={styles.background} />
            

            {/* Logo */}
            <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                    <Image 
                        source={{ uri: img }}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.logoText}>BREAKICE</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Phone verification</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                We've sent a 6-digit code{'\n'}
                to {formatPhoneNumber(username)}.{'\n'}
                It's valid for 5 minutes.
            </Text>

            {/* Input Field */}
            <View style={styles.inputContainer}>
                <View style={styles.inputBackground} />
                <TextInput
                    style={styles.input}
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    placeholder="Insert the code"
                    placeholderTextColor={COLORS.lightGray}
                    maxLength={6}
                    keyboardType="numeric"
                    secureTextEntry
                    textAlign="center"
                />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={[styles.continueButton, (!isFormValid || isLoading) && styles.continueButtonDisabled]}
                onPress={handleConfirmationCode}
                disabled={!isFormValid || isLoading}
            >
                <View style={styles.continueButtonBackground} />
                <Text style={styles.continueButtonText}>
                    {isLoading ? 'Verifying...' : 'Continue'}
                </Text>
            </TouchableOpacity>

            {/* Didn't receive code */}
            <Text style={styles.didntReceiveText}>Didn't receive the code?</Text>

            {/* Resend Button */}
            <TouchableOpacity
                style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}
                onPress={handleResendCode}
                disabled={resendTimer > 0}
            >
                <Text style={[styles.resendButtonText, resendTimer > 0 && styles.resendButtonTextDisabled]}>
                    {resendTimer > 0 ? `Resend in ${formatTimer(resendTimer)}` : 'Resend code'}
                </Text>
            </TouchableOpacity>

            {/* Change number */}
            <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => navigation.navigate('SigninSignupMain')}
            >
                <Text style={styles.changeNumberText}>Change number</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.background,
    },
    logoContainer: {
        position: 'absolute',
        top: 41,
        left: '50%',
        marginLeft: -141.5, // Half of 283 width
        width: 283,
        height: 87,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    logoImage: {
        width: 50,
        height: 50,
    },
    logoText: {
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Bold',
        fontSize: 21,
        fontWeight: '700',
        color: COLORS.red,
        letterSpacing: 4.83,
    },
    title: {
        position: 'absolute',
        top: 178,
        left: '50%',
        marginLeft: -169.5, // Half of 339 width
        width: 339,
        fontFamily: Platform.OS === 'ios' ? 'SF Pro Rounded' : 'SFProRounded-Semibold',
        fontSize: 32,
        fontWeight: '600',
        color: COLORS.black,
        textAlign: 'center',
    },
    subtitle: {
        position: 'absolute',
        top: 238,
        left: '50%',
        marginLeft: -158, // Half of 316 width
        width: 316,
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.black,
        textAlign: 'center',
        lineHeight: 24,
    },
    inputContainer: {
        position: 'absolute',
        top: 383,
        left: '50%',
        marginLeft: -131, // Half of 262 width
        width: 262,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
    },
    input: {
        width: '100%',
        height: '100%',
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: COLORS.black,
        textAlign: 'center',
        paddingHorizontal: 17,
        paddingVertical: 9,
        backgroundColor: 'transparent',
    },
    continueButton: {
        position: 'absolute',
        top: 467,
        left: '50%',
        marginLeft: -131, // Half of 262 width
        width: 262,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: {
        opacity: 0.5,
    },
    continueButtonBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.red,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    continueButtonText: {
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: COLORS.white,
        textAlign: 'center',
    },
    didntReceiveText: {
        position: 'absolute',
        top: 599,
        left: '50%',
        marginLeft: -158, // Half of 316 width
        width: 316,
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: COLORS.black,
        textAlign: 'center',
        letterSpacing: 2,
    },
    resendButton: {
        position: 'absolute',
        top: 631,
        left: '50%',
        marginLeft: -135.5, // Half of 271 width
        width: 271,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    resendButtonDisabled: {
        opacity: 0.5,
    },
    resendButtonText: {
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: COLORS.black,
        textAlign: 'center',
    },
    resendButtonTextDisabled: {
        color: COLORS.lightGray,
    },
    changeNumberButton: {
        position: 'absolute',
        top: 700,
        left: '50%',
        marginLeft: -158, // Half of 316 width
        width: 316,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeNumberText: {
        fontFamily: Platform.OS === 'ios' ? 'Rubik' : 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: COLORS.black,
        textAlign: 'center',
        letterSpacing: 2,
    },
});

export default SignupConfirmationScreen;