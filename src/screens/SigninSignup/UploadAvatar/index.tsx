import { useEffect, useState } from "react";
import { Alert, View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from "react-native";
import { Avatar, Button, Layout, Text } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

import { SigninSignupScreensList } from '../../../screensList/SigninSignupScreensList';

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";
import { uploadUserAvatar } from "../../../repositories/api/uploadUserAvatar";
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";
import useUserStore from "../../../repositories/localStorage/useUserStore";
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from "../../../repositories/globalEntities/User";

// Assets
const logoImage = require('../../../../assets/images/logo.png');
const avatarPlaceholderImage = require('../../../../assets/images/avatar-placeholder.svg');

type NavigationProp = StackNavigationProp<SigninSignupScreensList, 'SigninSignupUploadAvatar'>;

const SigninSignupUploadAvatarScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);

    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async () => {
        if (imageUri === undefined) {
            return;
        }

        setIsUploading(true);

        try {
            const avatarUrl = await uploadUserAvatar({ key, userId: user.id, imageUri });

            if (avatarUrl !== undefined) {
                // Update user with the new avatar URL in Zustand store
                const updatedUser = {
                    ...user,
                    avatar: avatarUrl
                };
                setUser(updatedUser);

                navigation.navigate('SigninSignupVoiceRecording');
            } else {
                Alert.alert("Upload failed", "There was a problem uploading the avatar. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            Alert.alert("Upload failed", "There was a problem uploading the avatar. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    const pickImage = async () => {
        if (isUploading) {
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission required", "Please grant camera roll permissions.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const skip = async () => {
        if (isUploading) {
            return;
        }

        await setUserProfileSectionStatus({ key, userId: user.id, section: PROFILE_SECTION_KEYS.AVATAR, value: PROFILE_SECTION_STATUS.SKIPPED });
        navigation.navigate('SigninSignupVoiceRecording');
    }

    useEffect(() => {
        if(imageUri === undefined) {
            return;
        }

        uploadImage();
    }, [imageUri]);

    return (
        <SafeAreaView style={figmaStyles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            
            {/* Header with Logo */}
            <View style={figmaStyles.headerContainer}>
                <View style={figmaStyles.logoHeader}>
                    <View style={figmaStyles.logoIcon}>
                        <Image 
                            source={logoImage}
                            style={figmaStyles.logoImage}
                        />
                    </View>
                    <Text style={figmaStyles.logoText}>BREAKICE</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={figmaStyles.content}>
                {/* Avatar Circle */}
                <View style={figmaStyles.avatarContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={figmaStyles.avatarImage} />
                    ) : (
                        <Image source={avatarPlaceholderImage} style={figmaStyles.avatarPlaceholder} />
                    )}
                </View>

                {/* Upload Button */}
                <TouchableOpacity 
                    style={[figmaStyles.uploadButton, isUploading && figmaStyles.uploadButtonDisabled]} 
                    onPress={pickImage}
                    disabled={isUploading}
                >
                    <Text style={figmaStyles.uploadButtonEmoji}>📷</Text>
                    <Text style={figmaStyles.uploadButtonText}>Upload image</Text>
                </TouchableOpacity>

                <Text style={figmaStyles.title}>Your avatar</Text>
                
                <Text style={figmaStyles.subtitle}>
                    Add a face to your presence here. You can change it anytime.
                </Text>

                <Text style={figmaStyles.recommendedText}>
                    Recommended—helps others recognize you and builds trust.
                </Text>

                {/* Skip Button */}
                <View style={figmaStyles.skipButtonContainer}>
                    <Button
                        style={[figmaStyles.skipButton, isUploading && figmaStyles.skipButtonDisabled]}
                        onPress={skip}
                        disabled={isUploading}
                    >
                        <Text style={figmaStyles.skipButtonText}>Skip</Text>
                    </Button>
                </View>
            </View>

            {/* Progress Section */}
            <View style={figmaStyles.progressSection}>
                <Text style={figmaStyles.stepText}>Step 2 of 7</Text>
                <View style={figmaStyles.progressBar}>
                    <View style={figmaStyles.progressFill} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const figmaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 0,
        height: 87,
        position: 'relative',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 0,
    },
    avatarContainer: {
        width: 173,
        height: 173,
        marginBottom: 20,
        marginTop: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 173,
        height: 173,
        borderRadius: 173 / 2,
    },
    avatarPlaceholder: {
        width: 173,
        height: 173,
    },
    uploadButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E23D3D',
        borderRadius: 100,
        width: 173,
        height: 173,
        marginBottom: 40,
    },
    uploadButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    uploadButtonEmoji: {
        fontSize: 36,
        marginBottom: -4,
    },
    uploadButtonText: {
        fontFamily: 'Rubik-Medium',
        fontSize: 20,
        fontWeight: '500',
        color: '#FFFFFF',
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
    recommendedText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        letterSpacing: 2,
        textAlign: 'center',
        width: 231,
        marginBottom: 40,
    },
    skipButtonContainer: {
        width: '100%',
        maxWidth: 262,
    },
    skipButton: {
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
    },
    skipButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    skipButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    progressSection: {
        alignItems: 'center',
        paddingBottom: 40,
        marginTop: 'auto',
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
        width: 70,
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
});

export default SigninSignupUploadAvatarScreen;