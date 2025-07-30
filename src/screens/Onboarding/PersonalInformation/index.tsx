import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Text, Button, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import LanguageSelector from './components/LanguageSelector';
import { LocationAutocompleteInput } from './components/LocationAutocompleteInput';
import CountrySelector from './components/CountrySelector';
import GenderSelector from './components/GenderSelector';

import { GENDER_OPTIONS, initUser, LocationData, User, UserGender } from '../../../repositories/globalEntities/User';
import { insertUser } from "../../../repositories/api/insertUser";
import useUserStore from '../../../repositories/localStorage/useUserStore';
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";

import styles from '../../../styles';
import { View } from 'react-native';

const OnboardingPersonalInformationScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const [name, setName] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState<string | undefined>(undefined);
    const [yearOfBirth, setYearOfBirth] = useState<number | undefined>(undefined);

    const [selectedGender, setSelectedGender] = useState<UserGender | undefined>(undefined);

    const [country, setCountry] = useState<string | undefined>(undefined);

    const [location, setLocation] = useState<LocationData | undefined>(undefined);

    const [languages, setLanguages] = useState<string[]>([]);

    const key: string = useAuthenticationStore((state: any) => state.key);
    const setUser = useUserStore((state: any) => state.setUser);

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
        if (name === undefined || surname === undefined || yearOfBirth === undefined ||
            selectedGender === undefined || location === undefined || languages.length === 0) {
            return;
        }

        let user: User = initUser({
            name, surname, gender: selectedGender, country, location, yearOfBirth, languages
        });

        console.log(user);

        user = await insertUser({ key, user });
        setUser(user);

        navigation.replace('OnboardingNavigator', { screen: "OnboardingUploadAvatar" });
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
                />
                <Input
                    style={styles.halfInput}
                    placeholder='Surname'
                    value={surname}
                    onChangeText={setSurname}
                    autoCapitalize='none'
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
            />

            <GenderSelector
                selectedGender={selectedGender}
                onSelectGender={setSelectedGender}
            />

            <CountrySelector selectedCountry={country} onSelectCountry={handleCountrySelect} />

            <LocationAutocompleteInput
                onSelectLocation={(location: LocationData | undefined) => setLocation(location)}
            />

            <LanguageSelector
                selectedLanguages={languages}
                setSelectedLanguages={setLanguages}
            />

            <Button
                style={styles.button}
                onPress={handleContinue}
            >
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingPersonalInformationScreen;