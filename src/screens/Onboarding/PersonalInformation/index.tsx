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

const OnboardingPersonalInformationScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const [name, setName] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState<string | undefined>(undefined);
    const [yearOfBirth, setYearOfBirth] = useState<number | undefined>(undefined);

    const [selectedGenderIndex, setSelectedGenderIndex] = useState<IndexPath | undefined>(undefined);
    const [selectedGenderValue, setSelectedGenderValue] = useState<UserGender | undefined>(undefined);

    const [countryList, setCountryList] = useState<string[]>([]);
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

    const handleSetUser = async () => {
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

    useEffect(() => {
        const names = countries.getNames('en', { select: 'official' });
        const sorted = Object.values(names).sort((a, b) => a.localeCompare(b));
        setCountryList(sorted);
    }, []);

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Profile</Text>

            <Input
                style={styles.input}
                placeholder='Name'
                value={name}
                onChangeText={setName}
                autoCapitalize='none'
            />
            <Input
                style={styles.input}
                placeholder='Surname'
                value={surname}
                onChangeText={setSurname}
                autoCapitalize='none'
            />
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
                placeholder='Gender'
                value={selectedGenderLabel}
                selectedIndex={selectedGenderIndex}
                onSelect={handleSelectGender}
            >
                {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} title={option.label} />
                ))}
            </Select>
            <Select
                style={styles.select}
                placeholder='Country'
                value={selectedCountryLabel}
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
                onPress={handleSetUser}
            >
                Send
            </Button>
        </Layout>
    );
};

export default OnboardingPersonalInformationScreen;