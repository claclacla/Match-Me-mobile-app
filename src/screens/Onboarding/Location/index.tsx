import React, { useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import { LocationAutocompleteInput } from '../PersonalInformation/components/LocationAutocompleteInput';
import { LocationData } from '../../../repositories/globalEntities/User';
import { insertUser } from "../../../repositories/api/insertUser";
import useUserStore from '../../../repositories/localStorage/useUserStore';
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";

import styles from '../../../styles';

const OnboardingLocationScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const [location, setLocation] = useState<LocationData | undefined>(undefined);

    const user = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);
    const key: string = useAuthenticationStore((state: any) => state.key);

    const handleContinue = async () => {
        if (location === undefined) {
            return;
        }

        // Update user with location
        const updatedUser = {
            ...user,
            location
        };

        console.log('Inserting user with location:', updatedUser);

        try {
            const insertedUser = await insertUser({ key, user: updatedUser });
            setUser(insertedUser);

            navigation.replace('OnboardingNavigator', { screen: "OnboardingUploadAvatar" });
        } catch (error) {
            console.error('Error inserting user:', error);
            // Handle error appropriately
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
        >
            <Layout style={[
                styles.container, 
                { 
                    justifyContent: 'flex-start', 
                    paddingTop: Platform.OS === 'ios' ? 80 : 60 
                }
            ]}>
                <View style={{ flex: 1, width: '100%' }}>
                    <Text style={styles.title}>Where are you located?</Text>

                    <Text style={styles.subtitle}>Help us find matches near you.</Text>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <LocationAutocompleteInput
                            onSelectLocation={(location: LocationData | undefined) => setLocation(location)}
                        />
                    </View>

                    <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
                        <Button
                            style={styles.button}
                            onPress={handleContinue}
                            disabled={location === undefined}
                        >
                            Continue
                        </Button>
                    </View>
                </View>
            </Layout>
        </KeyboardAvoidingView>
    );
};

export default OnboardingLocationScreen; 