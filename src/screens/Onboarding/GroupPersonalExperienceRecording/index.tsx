import { useEffect, useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import * as FileSystem from 'expo-file-system';
import { Audio } from "expo-av";

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";
import { setUserGroupPersonalExperience } from '../../../repositories/api/setUserGroupPersonalExperience';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from '../../../repositories/globalEntities/User';

import MicButton from './components/MicButton';

import styles from '../../../styles';

const recordingOptions = {
    android: {
        extension: '.m4a',
        outputFormat: 2, // MPEG_4 = 2
        audioEncoder: 3, // AAC = 3
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    ios: {
        extension: '.m4a',
        audioQuality: 127,      // corresponds to Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
    },
};

const OnboardingGroupPersonalExperienceRecordingScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);
    const setLocalStorageUserGroupPersonalExperience = useUserStore((state: any) => state.setUserGroupPersonalExperience);

    // TO DO: Set isRecording and recordingUri depending on the functions actions

    const [isRecording, setIsRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Request microphone permissions on mount

    useEffect(() => {
        (async () => {
            const response = await Audio.requestPermissionsAsync();
            if (response.status !== 'granted') {
                alert('Please grant audio recording permission!');
            }
        })();
    }, []);

    /*
    async function playRecording(uri: string) {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) {
                    console.error('Playback failed:', status.error);
                }
            });
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }
    */

    const sendRecording = async (uriToTranscribe: string) => {
        if (!uriToTranscribe) {
            alert("No recording available to transcribe!");
            return;
        }

        console.log("sendRecording. uriToTranscribe:", uriToTranscribe);

        setIsUploading(true);

        try {
            const userGroupPersonalExperience: string = await setUserGroupPersonalExperience({
                key,
                userId: user.id,
                audioUri: uriToTranscribe
            });

            console.log("Transcription:", userGroupPersonalExperience);

            setLocalStorageUserGroupPersonalExperience(userGroupPersonalExperience);

            navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsCover' });
        } catch (err: any) {
            console.error("Component: Errore durante la trascrizione:", err);
        } finally {
            setIsUploading(false);
        }
    };

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

            console.log('Recording stopped and stored at', uri);

            if (uri === null) {
                return;
            }

            const fileInfo = await FileSystem.getInfoAsync(uri);

            if (fileInfo.exists) {
                console.log("File size:", fileInfo.size);
            } else {
                console.log("The file doesn't exist:", fileInfo.uri);
            }

            setRecordingUri(uri);

            await sendRecording(uri);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const handleSkip = async () => {
        await setUserProfileSectionStatus({ key, userId: user.id, section: PROFILE_SECTION_KEYS.GROUP_PERSONAL_EXPERIENCE, value: PROFILE_SECTION_STATUS.SKIPPED });
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsCover' });
    }

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>If you feel like it</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Leave a short voice message about yourself, how you feel today, or how you move in relation to others.</Text>
                <Text style={styles.subtitle}>We'll use this to give your presence shape here, not to judge, but to hold.</Text>
            </Layout>

            <MicButton 
                onPress={isRecording ? stopRecording : startRecording}
                isRecording={isRecording !== null}
                disabled={isUploading}
            />

            <Button 
                onPress={handleSkip} 
                style={isUploading ? styles.buttonGhostDisabled : styles.buttonGhost}
                disabled={isUploading}
                appearance="ghost"
            >
                Skip
            </Button>
        </Layout>
    );
}

export default OnboardingGroupPersonalExperienceRecordingScreen;