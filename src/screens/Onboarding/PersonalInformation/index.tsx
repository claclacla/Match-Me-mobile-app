import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import LanguageSelector from './components/LanguageSelector';
import { LocationAutocompleteInput } from './components/LocationAutocompleteInput';

import { GENDER_OPTIONS, initUser, LocationData, User, UserGender } from '../../../repositories/globalEntities/User';
import { insertUser } from "../../../repositories/api/insertUser";
import useUserStore from '../../../repositories/localStorage/useUserStore';
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";

import styles from '../../../styles';
import { View } from 'react-native';

const initialCountryList = (() => {
    countries.registerLocale(en);
    const names = countries.getNames('en', { select: 'official' });
    return Object.values(names).sort((a, b) => a.localeCompare(b));
})();

const OnboardingPersonalInformationScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const [name, setName] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState<string | undefined>(undefined);
    const [yearOfBirth, setYearOfBirth] = useState<number | undefined>(undefined);

    const [selectedGenderIndex, setSelectedGenderIndex] = useState<IndexPath | undefined>(undefined);
    const [selectedGenderValue, setSelectedGenderValue] = useState<UserGender | undefined>(undefined);

    const [countryList, setCountryList] = useState<string[]>(initialCountryList);
    const [countryIndex, setCountryIndex] = useState<IndexPath | undefined>(undefined);
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

    const handleSelectGender = (index: IndexPath | IndexPath[]) => {
        const selectedIndex = Array.isArray(index) ? index[0] : index;
        setSelectedGenderIndex(selectedIndex);

        const selectedOption = GENDER_OPTIONS[selectedIndex.row];
        setSelectedGenderValue(selectedOption.value);
    };

    const handleSelectCountry = (index: IndexPath | IndexPath[]) => {
        const selectedIndex = Array.isArray(index) ? index[0] : index;
        setCountryIndex(selectedIndex);
        setCountry(countryList[selectedIndex.row]);
    };

    const handleContinue = async () => {
        if (name === undefined || surname === undefined || yearOfBirth === undefined ||
            selectedGenderValue === undefined || location === undefined || languages.length === 0) {
            return;
        }

        let user: User = initUser({
            name, surname, gender: selectedGenderValue, country, location, yearOfBirth, languages
        });

        console.log(user);

        user = await insertUser({ key, user });
        setUser(user);

        navigation.replace('OnboardingNavigator', { screen: "OnboardingUploadAvatar" });
    };

    const selectedGenderLabel = selectedGenderIndex ? GENDER_OPTIONS[selectedGenderIndex.row].label : undefined;
    const selectedCountryLabel = countryIndex ? countryList[countryIndex.row] : undefined;

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
            <Select
                style={styles.select}
                //placeholder='Gender'
                value={selectedGenderLabel || 'Select your gender'}
                selectedIndex={selectedGenderIndex}
                onSelect={handleSelectGender}
            >
                {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} title={option.label} />
                ))}
            </Select>

            <Select
                style={styles.select}
                //placeholder='Country'
                value={selectedCountryLabel || 'Select Your country'}
                selectedIndex={countryIndex}
                onSelect={handleSelectCountry}
            >
                {countryList.map((countryName, index) => (
                    <SelectItem key={index} title={countryName} />
                ))}
            </Select>

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