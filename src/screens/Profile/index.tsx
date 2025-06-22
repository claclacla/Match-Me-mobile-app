import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { Audio } from 'expo-av';

//import { useNavigation } from '@react-navigation/native';
//import { SigninScreenProp } from '../../nativeStackScreenProp/SigninScreenProps';

import { insertUser } from '../../repositories/api/insertUser';

import useAuthenticationStore from '../../repositories/localStorage/useAuthenticationStore';

import { GENDER_OPTIONS, User, UserGender } from '../../repositories/globalEntities/User';

import styles from '../../styles';

const recordingOptions = {
    android: {
        extension: '.m4a',
        outputFormat: 2, // MPEG_4 = 2
        audioEncoder: 3, // AAC = 3
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.caf',
        audioQuality: 127, // AUDIO_QUALITY_HIGH = 127
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    web: {
        // Puoi lasciare vuoto o mettere opzioni base per web (non serve per iOS/Android)
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
    },
};

const ProfileScreen = () => {
    const [isRecording, setIsRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);

    useEffect(() => {
        // Request microphone permissions on mount
        (async () => {
            const response = await Audio.requestPermissionsAsync();
            if (response.status !== 'granted') {
                alert('Please grant audio recording permission!');
            }
        })();
    }, []);

    const startRecording = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                recordingOptions
            );

            setIsRecording(recording);
            setRecordingUri(null);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!isRecording) return;

        try {
            await isRecording.stopAndUnloadAsync();
            const uri = isRecording.getURI();
            setRecordingUri(uri);
            setIsRecording(null);
            console.log('Recording stopped and stored at', uri);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };
    //const navigation = useNavigation<SigninScreenProp['navigation']>();

    /*
    const key = useAuthenticationStore((state: any) => state.key);

    const [name, setName] = useState<string | undefined>(undefined);
    const [age, setAge] = useState<number | undefined>(undefined);

    const [selectedGenderIndex, setSelectedGenderIndex] = useState<IndexPath | undefined>(undefined);
    const [selectedGenderValue, setSelectedGenderValue] = useState<UserGender | undefined>(undefined);

    const [location, setLocation] = useState<string | undefined>(undefined);
    const [bio, setBio] = useState<string | undefined>(undefined);

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

    const handleInsertUser = async () => {
        if (name === undefined || age === undefined ||
            selectedGenderValue === undefined || location === undefined || bio === undefined) {
            return;
        }

        const user: User = {
            id: "",
            name,
            age,
            gender: selectedGenderValue,
            location,
            bio
        };

        console.log(key, user);
        await insertUser({ key, user });
    };
    */

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

    //const selectedGenderLabel = selectedGenderIndex ? GENDER_OPTIONS[selectedGenderIndex.row].label : undefined;

    /*
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
    */

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>What about you?</Text>

            <Button style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
                {isRecording ? '🛑 Stop' : '🎤 Rec'}
            </Button>

            {recordingUri && (
                <>
                    <Text style={{ marginTop: 20 }}>Recorded file URI:</Text>
                    <Text selectable>{recordingUri}</Text>
                </>
            )}
        </Layout>
    );
};

export default ProfileScreen;