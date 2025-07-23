import { useState } from "react";
import { Alert } from "react-native";
import { Avatar, Button, Layout, Text } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { ApplicationNavigationProp } from "../../../stackNavigationProps/ApplicationNavigationProp";

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";
import { uploadUserAvatar } from "../../../repositories/api/uploadUserAvatar";
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";
import useUserStore from "../../../repositories/localStorage/useUserStore";
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from "../../../repositories/globalEntities/User";

import styles from "../../../styles";

const OnboardingUploadAvatarScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);

    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
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

    const uploadImage = async () => {
        if (imageUri === undefined) {
            return;
        }

        setUploading(true);

        const imageUrl = await uploadUserAvatar({ key, userId: user.id, imageUri });

        setUploading(false);

        if (imageUrl !== undefined) {
            navigation.replace('OnboardingNavigator', { screen: "OnboardingGroupBehaviorInsightsCover" });
        } else {
            Alert.alert("Upload failed", "There was a problem uploading the avatar. Please try again.");
        }
    }

    const skip = async () => {
        await setUserProfileSectionStatus({ key, userId: user.id, section: PROFILE_SECTION_KEYS.AVATAR, value: PROFILE_SECTION_STATUS.SKIPPED });
        navigation.replace('OnboardingNavigator', { screen: "OnboardingGroupBehaviorInsightsCover" });
    }

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Upload your avatar</Text>

            <Text style={styles.subtitle}>Put a face to your presence here.</Text>

            {imageUri && (
                <Avatar source={{ uri: imageUri }} size='giant' style={{ alignSelf: 'center', marginBottom: 20 }} />
            )}

            <Button onPress={pickImage} style={styles.button}>
                Select Image
            </Button>

            <Button onPress={uploadImage} style={styles.button} disabled={!imageUri || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>

            <Button onPress={skip} style={styles.button}>
                Skip for now, you can always add one later.
            </Button>
        </Layout>
    );
};

export default OnboardingUploadAvatarScreen;