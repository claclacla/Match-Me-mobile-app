import React, { useState, useMemo } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import { LocationAutocompleteInput } from '../components/LocationAutocompleteInput';
import { LocationData } from '../../../repositories/globalEntities/User';
import { insertUser } from "../../../repositories/api/insertUser";
import useUserStore from '../../../repositories/localStorage/useUserStore';
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";

// Assets
const logoImage = require('../../../../assets/images/logo.png');
const backArrowImage = require('../../../../assets/images/back-arrow.png');

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupLocation'>;

const SigninSignupLocationScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [location, setLocation] = useState<LocationData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const user = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);
    const key: string = useAuthenticationStore((state: any) => state.key);

    // Form validation
    const isFormValid = useMemo(() => {
        return location !== undefined;
    }, [location]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleContinue = async () => {
        if (!isFormValid || isLoading) {
            return;
        }

        setIsLoading(true);

        // Update user with location
        const updatedUser = {
            ...user,
            location
        };

        console.log('Inserting user with location:', updatedUser);

        try {
            const insertedUser = await insertUser({ key, user: updatedUser });
            setUser(insertedUser);

            navigation.navigate('SigninSignupUploadAvatar');
        } catch (error) {
            console.error('Error inserting user:', error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={figmaStyles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            
            {/* Header with Back Button and Logo */}
            <View style={figmaStyles.headerContainer}>
                <TouchableOpacity style={figmaStyles.backButton} onPress={handleBack}>
                    <Image source={backArrowImage} style={figmaStyles.backIcon} />
                    <Text style={figmaStyles.backText}>Back</Text>
                </TouchableOpacity>
                
                <View style={figmaStyles.logoHeader}>
                    <View style={figmaStyles.logoIcon}>
                        <Image 
                            source={logoImage}
                            style={figmaStyles.logoImage}
                        />
                    </View>
                    <Text style={figmaStyles.logoText}>BREAKICE</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={figmaStyles.content}>
                <Text style={figmaStyles.title}>Your neighbourhood</Text>
                
                <Text style={figmaStyles.subtitle}>
                    Where do you want to meet people?{'\n'}
                    This help us find groups near you.
                </Text>

                {/* Form Fields */}
                <View style={figmaStyles.formContainer}>
                    {/* Location Input */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>City or area</Text>
                        <LocationAutocompleteInput
                            onSelectLocation={(location: LocationData | undefined) => setLocation(location)}
                        />
                    </View>
                </View>

                {/* Continue Button */}
                <View style={figmaStyles.buttonContainer}>
                    <Button
                        style={[figmaStyles.continueButton, (!isFormValid || isLoading) && figmaStyles.continueButtonDisabled]}
                        onPress={handleContinue}
                        disabled={!isFormValid || isLoading}
                    >
                        <Text style={figmaStyles.continueButtonText}>
                            {isLoading ? 'Saving...' : 'Continue'}
                        </Text>
                    </Button>
                </View>
            </View>

            {/* Progress Section */}
            <View style={figmaStyles.progressSection}>
                <Text style={figmaStyles.stepText}>Step 3 of 7</Text>
                <View style={figmaStyles.progressBar}>
                    <View style={figmaStyles.progressFill} />
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        height: 87,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 17,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backIcon: {
        width: 23,
        height: 23,
        transform: [{ rotate: '270deg' }, { scaleY: -1 }],
        marginRight: 8,
    },
    backText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#1C1C1C',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
        marginBottom: 16,
        width: 339,
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 40,
        width: 306,
        lineHeight: 22,
    },
    formContainer: {
        width: '100%',
        maxWidth: 262,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 262,
        marginTop: 8,
    },
    continueButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    continueButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    progressSection: {
        alignItems: 'center',
        paddingBottom: 40,
        marginTop: 'auto',
    },
    stepText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        letterSpacing: 2,
        marginBottom: 16,
    },
    progressBar: {
        width: 244,
        height: 16,
        backgroundColor: '#EAEAEA',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        width: 105,
        height: '100%',
        backgroundColor: '#FFC10A',
        borderRadius: 2,
        shadowColor: 'rgba(8, 32, 56, 0.1)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
});

export default SigninSignupLocationScreen; 