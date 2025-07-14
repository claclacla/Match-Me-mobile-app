import { useState } from "react";
import { Alert } from "react-native";
import { Avatar, Button, Layout, Text } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { ApplicationNavigationProp } from "../../../stackNavigationProps/ApplicationNavigationProp";

import styles from "../../../styles";

const OnboardingUploadAvatarScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    
    const [imageUri, setImageUri] = useState<string | null>(null);
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

    }

    const skip = () => {
        navigation.replace('OnboardingNavigator', { screen: "OnboardingInsightsCover" });
    }

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Profile</Text>

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
                Skip
            </Button>
        </Layout>
    );
};

export default OnboardingUploadAvatarScreen;