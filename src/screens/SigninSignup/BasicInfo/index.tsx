import React, { useMemo, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import CountrySelector from '../components/CountrySelector';

import useUserStore from '../../../repositories/localStorage/useUserStore';

// Assets
const logoImage = require('../../../../assets/images/logo.png');

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupBasicInfo'>;

const SigninSignupBasicInfoScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [name, setName] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState<string | undefined>(undefined);
    const [country, setCountry] = useState<string | undefined>(undefined);

    const user = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);

    // Form validation
    const isFormValid = useMemo(() => {
        return (
            name !== undefined && 
            name.trim() !== '' &&
            surname !== undefined && 
            surname.trim() !== ''
        );
    }, [name, surname]);

    const handleCountrySelect = (selectedCountry: string) => {
        setCountry(selectedCountry);
        console.log('Selected country:', selectedCountry);
    };

    const handleContinue = async () => {
        if (!isFormValid) {
            return;
        }

        // Update user store with basic info
        const updatedUser = {
            ...user,
            name: name!.trim(),
            surname: surname!.trim(),
            country: country
        };

        console.log('Saving basic info to store:', updatedUser);
        setUser(updatedUser);

        navigation.navigate('SigninSignupPersonalDetails');
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
                <Text style={figmaStyles.title}>Let's get started</Text>
                
                <Text style={figmaStyles.subtitle}>
                    Tell us the essentials. Your full name won't be public to other users.
                </Text>

                {/* Form Fields */}
                <View style={figmaStyles.formContainer}>
                    {/* First Name */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>First name</Text>
                        <View style={figmaStyles.inputWrapper}>
                            <TextInput
                                style={figmaStyles.textInput}
                                placeholder="Enter your name"
                                placeholderTextColor="#818080"
                                value={name || ''}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Last Name */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>Last name</Text>
                        <View style={figmaStyles.inputWrapper}>
                            <TextInput
                                style={figmaStyles.textInput}
                                placeholder="Enter your surname"
                                placeholderTextColor="#818080"
                                value={surname || ''}
                                onChangeText={setSurname}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Nationality */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>Nationality</Text>
                        <View style={figmaStyles.inputWrapper}>
                            <CountrySelector 
                                selectedCountry={country} 
                                onSelectCountry={handleCountrySelect}
                                placeholder="Select Country"
                            />
                        </View>
                    </View>
                </View>

                {/* Continue Button */}
                <View style={figmaStyles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            figmaStyles.continueButton,
                            { backgroundColor: isFormValid ? '#E23D3D' : '#CCCCCC' }
                        ]}
                        onPress={handleContinue}
                        disabled={!isFormValid}
                    >
                        <Text style={figmaStyles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Progress Section */}
            <View style={figmaStyles.progressSection}>
                <Text style={figmaStyles.stepText}>Step 1 of 7</Text>
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
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        height: 87,
        paddingRight: 16, // Move the logo group to the left to compensate for negative margin
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
        width: 304,
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
    inputWrapper: {
        width: '100%',
        alignSelf: 'stretch',
    },
    textInput: {
        backgroundColor: '#F3EFED',
        borderRadius: 8,
        borderWidth: 0,
        height: 44,
        paddingHorizontal: 17,
        width: '100%',
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    continueButtonText: {
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
        width: 43,
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

export default SigninSignupBasicInfoScreen;
