import React, { useMemo, useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import CountrySelector from '../components/CountrySelector';

import useUserStore from '../../../repositories/localStorage/useUserStore';

import styles from '../../../styles';
import { View } from 'react-native';

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
        <Layout style={styles.container}>
            <Text style={styles.title}>Let's get started</Text>

            <Text style={styles.subtitle}>Tell us who you are, just the essentials.</Text>

            <View style={styles.rowContainer}>
                <Input
                    style={styles.halfInput}
                    placeholder='First name'
                    value={name}
                    onChangeText={setName}
                    autoCapitalize='words'
                    status={name !== undefined && name.trim() === '' ? 'danger' : 'basic'}
                />
                <Input
                    style={styles.halfInput}
                    placeholder='Last name'
                    value={surname}
                    onChangeText={setSurname}
                    autoCapitalize='words'
                    status={surname !== undefined && surname.trim() === '' ? 'danger' : 'basic'}
                />
            </View>

            <CountrySelector selectedCountry={country} onSelectCountry={handleCountrySelect} />

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

export default SigninSignupBasicInfoScreen;
