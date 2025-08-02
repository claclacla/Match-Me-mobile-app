import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Text, Button, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import LanguageSelector from './components/LanguageSelector';
import CountrySelector from './components/CountrySelector';
import GenderSelector from './components/GenderSelector';

import { GENDER_OPTIONS, initUser, User, UserGender } from '../../../repositories/globalEntities/User';
import useUserStore from '../../../repositories/localStorage/useUserStore';

import styles from '../../../styles';
import { View } from 'react-native';

const OnboardingPersonalInformationScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const [name, setName] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState<string | undefined>(undefined);
    const [yearOfBirth, setYearOfBirth] = useState<number | undefined>(undefined);

    const [selectedGender, setSelectedGender] = useState<UserGender | undefined>(undefined);

    const [country, setCountry] = useState<string | undefined>(undefined);

    const [languages, setLanguages] = useState<string[]>([]);

    const setUser = useUserStore((state: any) => state.setUser);

    // Form validation
    const isFormValid = useMemo(() => {
        return (
            name !== undefined && 
            name.trim() !== '' &&
            surname !== undefined && 
            surname.trim() !== '' &&
            yearOfBirth !== undefined &&
            selectedGender !== undefined &&
            languages.length > 0
        );
    }, [name, surname, yearOfBirth, selectedGender, languages]);

    const handleYearOfBirthChange = (text: string) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        const parsedAge = parseInt(filteredText, 10);
        setYearOfBirth(isNaN(parsedAge) ? undefined : parsedAge);
    };

    const handleCountrySelect = (selectedCountry: string) => {
        setCountry(selectedCountry);
        console.log('Selected country:', selectedCountry);
    };

    const handleContinue = async () => {
        if (!isFormValid) {
            return;
        }

        let user: User = initUser({
            name: name!.trim(), 
            surname: surname!.trim(), 
            gender: selectedGender!, 
            country, 
            yearOfBirth: yearOfBirth!, 
            languages
        });

        console.log('Saving user to store:', user);
        setUser(user);

        navigation.replace('OnboardingNavigator', { screen: "OnboardingLocation" });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Let's get started</Text>

            <Text style={styles.subtitle}>Tell us who you are, just the essentials.</Text>

            <View style={styles.rowContainer}>
                <Input
                    style={styles.halfInput}
                    placeholder='Name'
                    value={name}
                    onChangeText={setName}
                    autoCapitalize='none'
                    status={name !== undefined && name.trim() === '' ? 'danger' : 'basic'}
                />
                <Input
                    style={styles.halfInput}
                    placeholder='Surname'
                    value={surname}
                    onChangeText={setSurname}
                    autoCapitalize='none'
                    status={surname !== undefined && surname.trim() === '' ? 'danger' : 'basic'}
                />
            </View>

            <Input
                style={styles.input}
                placeholder='Year of birth'
                value={yearOfBirth === undefined ? '' : yearOfBirth.toString()}
                onChangeText={handleYearOfBirthChange}
                keyboardType='numeric'
                // keyboardType='number-pad' 
                maxLength={4}
                status={yearOfBirth === undefined ? 'danger' : 'basic'}
            />

            <GenderSelector
                selectedGender={selectedGender}
                onSelectGender={setSelectedGender}
            />

            <CountrySelector selectedCountry={country} onSelectCountry={handleCountrySelect} />

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

export default OnboardingPersonalInformationScreen;