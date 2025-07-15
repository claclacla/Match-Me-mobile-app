import * as FileSystem from 'expo-file-system';

import { API } from "../../config/config.json";

interface UploadUserAvatarParams {
    key: string;
    userId: string;
    imageUri: string; // local file URI
}

export async function uploadUserAvatar({ key, userId, imageUri }: UploadUserAvatarParams): Promise<boolean> {
    try {
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Guess content type from extension (simple way)
        const contentType = imageUri.endsWith(".png") ? "image/png" : "image/jpeg";

        const response = await fetch(`${API.ADDRESS}/user/${userId}/uploadAvatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                imageData: base64Image,
                contentType,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            console.error("Upload failed:", json);
            return false;
        }

        //const { imageUrl } = await uploadResponse.json();

        return true;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return false;
    }
}
