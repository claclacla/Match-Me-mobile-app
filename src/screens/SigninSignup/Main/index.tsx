import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, TextInput, Modal, FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../../hooks/useAuthentication';
import { useHandleSignInUserFlow } from '../../../hooks/useHandleSignInUserFlow';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import { getUser } from "../../../repositories/api/getUser";
import useUserStore from "../../../repositories/localStorage/useUserStore";
import { User } from '../../../repositories/globalEntities/User';

// Figma Design Colors
const COLORS = {
  background: '#FAF5F1',
  primary: '#E23D3D',
  primaryPressed: '#D03434',
  text: '#121212',
  placeholder: '#818080',
  fieldBg: '#F3EFED',
  border: '#E5E1DB',
  white: '#FFFFFF',
  gray500: '#6E7280',
};

// Country data with flags and dial codes
const COUNTRIES = [
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
];

const SigninSignupScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const { signIn, signUp } = useAuthentication();

    const setUser = useUserStore((state: any) => state.setUser);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showCountryModal, setShowCountryModal] = useState<boolean>(false);

    // Form validation
    const isFormValid = useMemo(() => {
        return (
            username.trim() !== '' &&
            password.trim() !== '' &&
            password.length >= 6
        );
    }, [username, password]);

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const fullPhoneNumber = `${selectedCountry.dialCode}${username.trim()}`;
            
            try {
                // First, try to sign up (to check if user exists)
                const signUpResult = await signUp({ 
                    username: fullPhoneNumber, 
                    password: password.trim() 
                });

                console.log('New user registered successfully');

                // User doesn't exist, signup successful - navigate to confirmation
                navigation.navigate('SigninSignupConfirmation', { 
                    username: fullPhoneNumber 
                });

            } catch (signUpError: any) {
                // If signup fails because user already exists, try to sign them in
                if (signUpError.message.includes('This user already exists') ||
                    signUpError.message.includes('UsernameExistsException')) {
                    
                    console.log('User already exists, attempting sign in...');
                    
                    try {
                        // User exists, try to sign in
                        const key = await signIn({ username: fullPhoneNumber, password: password.trim() });

                        if (key === undefined) {
                            setErrorMessage('Sign in failed. Please try again.');
                            return;
                        }

                        console.log('User signed in successfully');
                        
                        // User exists and signed in successfully
                        const user: User | undefined = await getUser({ key });
                        setUser(user);
                        useHandleSignInUserFlow({ navigation, user });

                    } catch (signInError: any) {
                        // User exists but wrong credentials
                        if (signInError.message.includes('NotAuthorizedException')) {
                            setErrorMessage('Invalid phone number or password.');
                        } else {
                            console.error('SignIn failed:', signInError.message);
                            setErrorMessage(signInError.message || 'Sign in failed. Please try again.');
                        }
                    }
                } else if (signUpError.message.includes('InvalidPasswordException')) {
                    console.error('Password validation failed:', signUpError.message);
                    setErrorMessage('Password must be at least 6 characters.');
                } else {
                    console.error('Registration failed:', signUpError.message);
                    setErrorMessage(signUpError.message || 'Registration failed. Please try again.');
                }
            }

        } catch (error: any) {
            console.error('Unexpected error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIcon} />
                        <Text style={styles.logoText}>BREAKICE</Text>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Title Section */}
                    <Text style={styles.title}>Sign up or log in</Text>
                    <Text style={styles.subtitle}>Insert your account data</Text>
                    
                    {/* Free Badge */}
                    <View style={styles.freeBadge}>
                        <Text style={styles.freeBadgeText}>It's free!</Text>
                    </View>

                    {/* Phone Number Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Phone number</Text>
                        <View style={styles.phoneInputContainer}>
                            <TouchableOpacity 
                                style={styles.countrySelector}
                                onPress={() => setShowCountryModal(true)}
                            >
                                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                                <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
                            </TouchableOpacity>
                            <View style={styles.phoneInputField}>
                                <TextInput
                                    style={styles.phoneTextInput}
                                    placeholder="312 3456789"
                                    placeholderTextColor={COLORS.placeholder}
                                    value={username}
                                    onChangeText={setUsername}
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputField}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Use at least 8 characters"
                                placeholderTextColor={COLORS.placeholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <View style={styles.passwordOptions}>
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Forgot password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={styles.showHide}>{showPassword ? 'Hide' : 'Show'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Error Message */}
                    {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            { backgroundColor: isFormValid && !isLoading ? COLORS.primary : COLORS.gray500 }
                        ]}
                        onPress={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        <Text style={styles.continueButtonText}>
                            {isLoading ? 'Loading...' : 'Continue for free →'}
                        </Text>
                    </TouchableOpacity>

                    {/* Helper Text */}
                    <Text style={styles.helperText}>
                        We'll create your account if you're new.
                    </Text>

                    {/* Support Link */}
                    <Text style={styles.supportText}>
                        Having trouble logging in? Contact support.
                    </Text>

                    {/* Legal Disclaimer */}
                    <Text style={styles.legalText}>
                        I enter my number, consent to texts, accept the User Terms, and acknowledge the Privacy Statement.
                    </Text>
                </View>

                {/* Country Selection Modal */}
                <Modal
                    visible={showCountryModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCountryModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.countryModal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Country</Text>
                                <TouchableOpacity 
                                    style={styles.modalCloseButton}
                                    onPress={() => setShowCountryModal(false)}
                                >
                                    <Text style={styles.modalCloseText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={COUNTRIES}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.countryItem,
                                            selectedCountry.code === item.code && styles.selectedCountryItem
                                        ]}
                                        onPress={() => {
                                            setSelectedCountry(item);
                                            setShowCountryModal(false);
                                        }}
                                    >
                                        <Text style={styles.countryFlag}>{item.flag}</Text>
                                        <Text style={styles.countryName}>{item.name}</Text>
                                        <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.countryList}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F1',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5F1',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFC10A',
    borderWidth: 2,
    borderColor: '#121212',
  },
  logoText: {
    fontSize: 21,
    fontWeight: Platform.OS === 'ios' ? '700' : '800',
    color: '#E23D3D',
    letterSpacing: 4.83,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#121212',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 16,
  },
  freeBadge: {
    backgroundColor: '#FFC10A',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'center',
    marginBottom: 32,
  },
  freeBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    color: '#6E7280',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#F3EFED',
    borderRadius: 8,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E1DB',
    height: 44,
    justifyContent: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3EFED',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E1DB',
    height: 44,
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E1DB',
    minWidth: 80,
  },
  flagText: {
    fontSize: 18,
    marginRight: 6,
  },
  dialCodeText: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '500',
  },
  phoneInputField: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  phoneTextInput: {
    fontSize: 18,
    color: '#121212',
    padding: 0,
    margin: 0,
  },
  textInput: {
    fontSize: 18,
    color: '#121212',
    padding: 0,
    margin: 0,
  },
  passwordOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: '#121212',
    textDecorationLine: 'underline',
  },
  showHide: {
    fontSize: 14,
    color: '#121212',
  },
  errorMessage: {
    fontSize: 14,
    color: '#E23D3D',
    textAlign: 'center',
    marginBottom: 16,
  },
  continueButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 14,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 32,
  },
  supportText: {
    fontSize: 13,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 16,
  },
  legalText: {
    fontSize: 10,
    color: '#121212',
    textAlign: 'center',
    lineHeight: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  countryModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E1DB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121212',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3EFED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '600',
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E1DB',
  },
  selectedCountryItem: {
    backgroundColor: '#F3EFED',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#121212',
  },
  countryDialCode: {
    fontSize: 16,
    color: '#6E7280',
    fontWeight: '500',
  },
});

export default SigninSignupScreen;
