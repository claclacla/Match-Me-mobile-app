import { useState } from "react";
import { Avatar, Button, Layout, Text } from "@ui-kitten/components";

import styles from "../../../styles";

const OnboardingUploadAvatarScreen = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {

    }

    const uploadImage = async () => {
        
    }

    // navigation.replace('OnboardingNavigator', { screen: "OnboardingInsightsCover" });

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
        </Layout>
    );
};

export default OnboardingUploadAvatarScreen;