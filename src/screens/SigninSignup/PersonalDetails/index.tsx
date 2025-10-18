import React, { useMemo, useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import LanguageSelector from '../../../components/LanguageSelector';
import GenderSelector from '../components/GenderSelector';

import { initUser, User, UserGender } from '../../../repositories/globalEntities/User';
import useUserStore from '../../../repositories/localStorage/useUserStore';

import styles from '../../../styles';

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
        <Layout style={styles.container}>
            <Text style={styles.title}>Personal details</Text>

            <Text style={styles.subtitle}>A few more details to complete your profile.</Text>

            <Input
                style={styles.input}
                placeholder='Year of birth'
                value={yearOfBirth === undefined ? '' : yearOfBirth.toString()}
                onChangeText={handleYearOfBirthChange}
                keyboardType='numeric'
                maxLength={4}
                status={yearOfBirth === undefined ? 'danger' : 'basic'}
            />


            <GenderSelector
                selectedGender={selectedGender}
                onSelectGender={setSelectedGender}
            />

            <LanguageSelector
                selectedLanguages={languages}
                setSelectedLanguages={setLanguages}
            />

            <Button
                style={isFormValid ? styles.button : styles.buttonDisabled}
                onPress={handleContinue}
                disabled={!isFormValid}
            >
                Continue
            </Button>
        </Layout>
    );
};

export default SigninSignupPersonalDetailsScreen;
