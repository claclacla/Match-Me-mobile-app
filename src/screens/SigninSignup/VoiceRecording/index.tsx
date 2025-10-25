import { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import * as FileSystem from 'expo-file-system';
import { Audio } from "expo-av";

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";
import { setUserGroupPersonalExperienceFromVoice } from '../../../repositories/api/setUserGroupPersonalExperienceFromVoice';
import { setUserGroupPersonalExperienceFromText } from '../../../repositories/api/setUserGroupPersonalExperienceFromText';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';
import { StackNavigationProp } from '@react-navigation/stack';

import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from '../../../repositories/globalEntities/User';

// Assets
const logoImage = require('../../../../assets/images/logo.png');

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

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupVoiceRecording'> & ApplicationNavigationProp;

const SigninSignupVoiceRecordingScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);
    const setLocalStorageUserGroupPersonalExperience = useUserStore((state: any) => state.setUserGroupPersonalExperience);

    // TO DO: Set isRecording and recordingUri depending on the functions actions

    const [isRecording, setIsRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [permissionLoading, setPermissionLoading] = useState<boolean>(true);
    const [showTextInput, setShowTextInput] = useState<boolean>(false);
    const [textNote, setTextNote] = useState<string>('');

    // Request microphone permissions on mount
    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            setPermissionLoading(true);
            
            // First check if we already have permission
            const { status: existingStatus } = await Audio.getPermissionsAsync();
            
            if (existingStatus === 'granted') {
                setHasPermission(true);
                setPermissionLoading(false);
                return;
            }

            // If not, request permission
            const { status } = await Audio.requestPermissionsAsync();
            
            if (status === 'granted') {
                setHasPermission(true);
            } else {
                setHasPermission(false);
                console.log('Audio recording permission denied');
            }
        } catch (error) {
            console.error('Error requesting audio permission:', error);
            setHasPermission(false);
        } finally {
            setPermissionLoading(false);
        }
    };

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
            const userGroupPersonalExperience: string = await setUserGroupPersonalExperienceFromVoice({
                key,
                userId: user.id,
                audioUri: uriToTranscribe
            });

            console.log("Transcription:", userGroupPersonalExperience);

            setLocalStorageUserGroupPersonalExperience(userGroupPersonalExperience);

            navigation.navigate('SigninSignupSignupOutro');
        } catch (err: any) {
            console.error("Component: Errore durante la trascrizione:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const startRecording = async () => {
        // Check permission before starting
        if (!hasPermission) {
            console.log('No audio permission, requesting...');
            await requestPermissions();
            if (!hasPermission) {
                alert('Audio recording permission is required to record your voice message.');
                return;
            }
        }

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
        } catch (err: any) {
            console.error('Failed to start recording', err);
            
            // If recording fails, check if it's a permission issue
            if (err.message && err.message.includes('permission')) {
                alert('Audio recording permission is required. Please enable it in your device settings.');
            }
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
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingFork' });
    }

    const handleWriteNote = () => {
        setShowTextInput(true);
    }

    const handleSubmitTextNote = async () => {
        if (!textNote.trim()) {
            Alert.alert("Empty note", "Please write something before submitting.");
            return;
        }

        setIsUploading(true);

        try {
            const userGroupPersonalExperience: string = await setUserGroupPersonalExperienceFromText({
                key,
                userId: user.id,
                personalExperience: textNote.trim()
            });

            console.log("Text note submitted:", userGroupPersonalExperience);

            setLocalStorageUserGroupPersonalExperience(userGroupPersonalExperience);
            navigation.navigate('SigninSignupSignupOutro');
        } catch (err: any) {
            console.error("Error submitting text note:", err);
            Alert.alert("Error", "There was a problem submitting your note. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    if (permissionLoading) {
        return (
            <SafeAreaView style={figmaStyles.container}>
                <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
                <View style={figmaStyles.loadingContainer}>
                    <Text style={figmaStyles.loadingTitle}>Setting up audio...</Text>
                    <Text style={figmaStyles.loadingSubtitle}>Requesting microphone permission</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={figmaStyles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />

            {/* Logo Header */}
            <View style={figmaStyles.logoHeader}>
                <View style={figmaStyles.logoIcon}>
                    <Image
                        source={logoImage}
                        style={figmaStyles.logoImage}
                    />
                </View>
                <Text style={figmaStyles.logoText}>BREAKICE</Text>
            </View>

            {/* Main Content */}
            <KeyboardAvoidingView 
                style={figmaStyles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={figmaStyles.scrollContent}>
                    <Text style={figmaStyles.title}>Your voice</Text>

                    <Text style={figmaStyles.subtitle}>
                        Optional voice note (up to 60s).
                    </Text>

                    <Text style={figmaStyles.subtitle}>
                    It helps us match you with the right group. It's always private.{'\n'}
                    Not to judge, but to connect.
                    </Text>

                    <Text style={figmaStyles.subtitle2}>
                        • Why you joined{'\n'}
                        • What energizes you{'\n'}
                        • What you're looking for
                    </Text>

                    {showTextInput ? (
                        <View style={figmaStyles.textInputContainer}>
                            <TextInput
                                style={figmaStyles.textArea}
                                placeholder="Write your note here..."
                                placeholderTextColor="#999999"
                                value={textNote}
                                onChangeText={setTextNote}
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                editable={!isUploading}
                            />
                            <View style={figmaStyles.submitButtonContainer}>
                                <TouchableOpacity
                                    onPress={handleSubmitTextNote}
                                    style={[
                                        figmaStyles.submitButton,
                                        { backgroundColor: textNote.trim() && !isUploading ? '#E23D3D' : '#CCCCCC' }
                                    ]}
                                    disabled={!textNote.trim() || isUploading}
                                >
                                    <Text style={figmaStyles.submitButtonText}>
                                        {isUploading ? 'Submitting...' : 'Submit'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            {!hasPermission ? (
                                <View style={figmaStyles.permissionContainer}>
                                    <Text style={figmaStyles.permissionText}>
                                        Audio recording permission is required to record your voice message.
                                    </Text>
                                <TouchableOpacity
                                    onPress={requestPermissions}
                                    style={figmaStyles.permissionButton}
                                >
                                    <Text style={figmaStyles.permissionButtonText}>Grant Permission</Text>
                                </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={figmaStyles.recordingButtonContainer}>
                                    <TouchableOpacity
                                        onPress={isRecording ? stopRecording : startRecording}
                                        style={[
                                            figmaStyles.recordingButton,
                                            { backgroundColor: !isUploading ? '#E23D3D' : '#CCCCCC' }
                                        ]}
                                        disabled={isUploading}
                                    >
                                        <Text style={figmaStyles.recordingButtonText}>
                                            {isRecording ? 'Stop Recording' : 'Start recording'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Write Note Instead Button */}
                            <View style={figmaStyles.writeNoteButtonContainer}>
                                <TouchableOpacity
                                    onPress={handleWriteNote}
                                    style={figmaStyles.writeNoteButton}
                                    disabled={isUploading}
                                >
                                    <Text style={figmaStyles.writeNoteButtonText}>Write note instead</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Progress Section */}
            <View style={figmaStyles.progressSection}>
                <Text style={figmaStyles.stepText}>Step 5 of 7</Text>
                <View style={figmaStyles.progressBar}>
                    <View style={figmaStyles.progressFill} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const figmaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 0,
        paddingRight: 16,
    },
    logoIcon: {
        width: 72,
        height: 72,
        marginRight: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    logoText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 26,
        fontWeight: '700',
        color: '#E23D3D',
        letterSpacing: 4.83,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 32,
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
        width: 339,
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
        width: 282,
        lineHeight: 22,
    },
    subtitle2: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 40,
        width: 339,
        lineHeight: 22,
    },
    permissionContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    permissionText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#E23D3D',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    permissionButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        paddingHorizontal: 20,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    recordingButtonContainer: {
        width: '100%',
        maxWidth: 262,
        marginBottom: 20,
    },
    recordingButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    recordingButtonText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    writeNoteButtonContainer: {
        width: '100%',
        maxWidth: 262,
        marginTop: 20,
    },
    writeNoteButton: {
        backgroundColor: '#F3EFED',
        borderRadius: 8,
        height: 45,
        borderWidth: 1,
        borderColor: '#E23D3D',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    writeNoteButtonText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#E23D3D',
        textAlign: 'center',
    },
    textInputContainer: {
        width: '100%',
        maxWidth: 262,
        marginTop: 20,
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 16,
        minHeight: 200,
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        color: '#000000',
        marginBottom: 16,
        textAlignVertical: 'top',
    },
    submitButtonContainer: {
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    progressSection: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    stepText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        letterSpacing: 2,
        marginBottom: 16,
    },
    progressBar: {
        width: 244,
        height: 16,
        backgroundColor: '#EAEAEA',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        width: 175,
        height: '100%',
        backgroundColor: '#FFC10A',
        borderRadius: 2,
        shadowColor: 'rgba(8, 32, 56, 0.1)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    loadingTitle: {
        fontFamily: 'Rubik-Medium',
        fontSize: 24,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 16,
    },
    loadingSubtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#666666',
        textAlign: 'center',
    },
});

export default SigninSignupVoiceRecordingScreen;