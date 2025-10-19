import React, { useMemo, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import LanguageSelector from '../../../components/LanguageSelector';
import GenderSelector from '../components/GenderSelector';

import { initUser, User, UserGender } from '../../../repositories/globalEntities/User';
import useUserStore from '../../../repositories/localStorage/useUserStore';

// Assets
const logoImage = require('../../../../assets/images/logo.png');
const backArrowImage = require('../../../../assets/images/back-arrow.png');

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupPersonalDetails'>;

const SigninSignupPersonalDetailsScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [yearOfBirth, setYearOfBirth] = useState<number | undefined>(undefined);
    const [selectedGender, setSelectedGender] = useState<UserGender | undefined>(undefined);
    const [languages, setLanguages] = useState<string[]>([]);

    const user = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);

    // Form validation
    const isFormValid = useMemo(() => {
        return (
            yearOfBirth !== undefined &&
            selectedGender !== undefined &&
            languages.length > 0
        );
    }, [yearOfBirth, selectedGender, languages]);

    const handleYearOfBirthChange = (text: string) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        const parsedAge = parseInt(filteredText, 10);
        setYearOfBirth(isNaN(parsedAge) ? undefined : parsedAge);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleContinue = async () => {
        if (!isFormValid) {
            return;
        }

        // Create complete user with all collected information
        let completeUser: User = initUser({
            name: user?.name || '', 
            surname: user?.surname || '', 
            gender: selectedGender!, 
            country: user?.country,
            yearOfBirth: yearOfBirth!, 
            languages
        });

        console.log('Saving complete user to store:', completeUser);
        setUser(completeUser);

        navigation.navigate('SigninSignupLocation');
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
                <Text style={figmaStyles.title}>Hi, {user?.name || 'NAME'} 👋</Text>
                
                <Text style={figmaStyles.subtitle}>
                    Let's complete your profile. Your age won't be public to other users.
                </Text>

                {/* Form Fields */}
                <View style={figmaStyles.formContainer}>
                    {/* Year of Birth */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>Year of birth</Text>
                        <View style={figmaStyles.inputWrapper}>
                            <TextInput
                                style={figmaStyles.textInput}
                                placeholder="e.g. 1994"
                                placeholderTextColor="#818080"
                                value={yearOfBirth === undefined ? '' : yearOfBirth.toString()}
                                onChangeText={handleYearOfBirthChange}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                        </View>
                    </View>

                    {/* Languages */}
                    <View style={figmaStyles.fieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>Languages</Text>
                        <LanguageSelector
                            selectedLanguages={languages}
                            setSelectedLanguages={setLanguages}
                        />
                    </View>

                    {/* Gender */}
                    <View style={figmaStyles.genderFieldContainer}>
                        <Text style={figmaStyles.fieldLabel}>Gender</Text>
                        <GenderSelector
                            selectedGender={selectedGender}
                            onSelectGender={setSelectedGender}
                        />
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
                <Text style={figmaStyles.stepText}>Step 2 of 7</Text>
                <View style={figmaStyles.progressBar}>
                    <View style={figmaStyles.progressFill} />
                </View>
                <Text style={figmaStyles.privacyText}>Your birth year is not public.</Text>
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
        width: 287,
        lineHeight: 22,
    },
    formContainer: {
        width: '100%',
        maxWidth: 262,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    genderFieldContainer: {
        marginBottom: 16,
        marginTop: -16,
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
        marginTop: 4,
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
        marginBottom: 16,
    },
    progressFill: {
        width: 70,
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
    privacyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        letterSpacing: 2,
        textAlign: 'center',
        width: 255,
    },
});

export default SigninSignupPersonalDetailsScreen;
