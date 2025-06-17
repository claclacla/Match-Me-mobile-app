import React, { useState } from 'react';
import { Layout, Text, Button, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';

//import { useNavigation } from '@react-navigation/native';
//import { SigninScreenProp } from '../../nativeStackScreenProp/SigninScreenProps';

import { findSimilarUsersById } from '../../repositories/api/findSimilarUsersById';

import useAuthenticationStore from '../../repositories/localStorage/useAuthenticationStore';

import styles from '../../styles';

export type UserGender = 'male' | 'female' | 'not_binary' | 'prefer_not_to_say';

export const GENDER_OPTIONS = [
    { label: 'Uomo', value: 'male' as UserGender },
    { label: 'Donna', value: 'female' as UserGender },
    { label: 'Non binario', value: 'non_binary' as UserGender },
    { label: 'Preferisco non specificare', value: 'prefer_not_to_say' as UserGender },
];

export const DEFAULT_GENDER: UserGender = 'prefer_not_to_say';

const MainScreen = () => {
    //const navigation = useNavigation<SigninScreenProp['navigation']>();
    const key = useAuthenticationStore((state: any) => state.key);

    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number | undefined>(undefined);

    const [selectedGenderIndex, setSelectedGenderIndex] = useState<IndexPath | undefined>(undefined);
    const [selectedGenderValue, setSelectedGenderValue] = useState<UserGender | undefined>(undefined);

    const [location, setLocation] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    const handleAgeChange = (text: string) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        const parsedAge = parseInt(filteredText, 10);
        setAge(isNaN(parsedAge) ? undefined : parsedAge);
    };

    const handleSelectGender = (index: IndexPath | IndexPath[]) => {
        const selectedIndex = Array.isArray(index) ? index[0] : index;
        setSelectedGenderIndex(selectedIndex);

        const selectedOption = GENDER_OPTIONS[selectedIndex.row];
        setSelectedGenderValue(selectedOption.value);
    };

    const handleInsertUser = () => {

    };

    /*
    - findSimilarUsersByIdWithKey IMPLEMENTATION

    useEffect(() => {
        if(key === undefined) {
            return;
        }

        console.log(key);

        const findSimilarUsersByIdWithKey = async () => {
            const response: string = await findSimilarUsersById({ key });
            console.log(response);
        };

        findSimilarUsersByIdWithKey();
    }, [key]);
    */

    //const goBack = () => {
    //    navigation.goBack();
    //};

    const selectedGenderLabel = selectedGenderIndex ? GENDER_OPTIONS[selectedGenderIndex.row].label : undefined;

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
                placeholder='Age'
                value={age === undefined ? '' : age.toString()}
                onChangeText={handleAgeChange}
                keyboardType='numeric'
                // keyboardType='number-pad' 
                maxLength={3}
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
            <Input
                style={styles.input}
                placeholder='Location'
                value={location}
                onChangeText={setLocation}
            />
            <Input
                style={styles.multiLineInput}
                placeholder='Bio'
                value={bio}
                onChangeText={setBio}
                multiline={true}
                numberOfLines={4}
                textAlignVertical='top'
            />

            <Button
                style={styles.button}
                onPress={handleInsertUser}
            >
                Send
            </Button>
        </Layout>
    );
};

export default MainScreen;