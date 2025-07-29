import * as FileSystem from 'expo-file-system';

import { API } from "../../config/config.json";

export async function setUserGroupPersonalExperience({
    key,
    userId,
    audioUri
}: {
    key: string;
    userId: string;
    audioUri: string;
}): Promise<string> {
    console.log("API Service: file reading...");
    console.log("API Service: URI Audio:", audioUri);

    if (!audioUri) {
        console.error("API Service: Errore: URI Audio missing. Upload stop.");
        throw new Error("Audio URI is missing. Cannot upload.");
    }

    const fileExtension = audioUri.split('.').pop()?.toLowerCase();

    let mimeType: string;

    switch (fileExtension) {
        case 'm4a':
            mimeType = 'audio/m4a';
            break;
        case 'caf':
            mimeType = 'audio/x-caf';
            break;
        case 'webm':
            mimeType = 'audio/webm';
            break;
        default:
            mimeType = 'application/octet-stream';
            console.warn(`API Service: Reading error: ${fileExtension}. MIME type defined for the file: ${mimeType}`);
    }

    try {
        const fileInfo = await FileSystem.getInfoAsync(audioUri, { md5: false, size: false });

        if (fileInfo.exists && (fileInfo as any).mimeType) {
            mimeType = (fileInfo as any).mimeType;
            console.log("API Service: MIME Type:", mimeType);
        }
    } catch (e) {
        console.warn("API Service: Myme type error:", e);
    }

    console.log("Mime type: ", mimeType);

    const formData = new FormData();

    formData.append('file', {
        uri: audioUri,
        name: `recording.${fileExtension || 'm4a'}`,
        type: mimeType,
    } as any);

    console.log("--- Checking FormData Contents ---");
    let fileFound = false;
    for (const pair of (formData as any).entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        if (pair[0] === 'file' && pair[1] instanceof Blob) { 
            console.log(`  File details: Name: ${(pair[1] as any)._data.name}, Type: ${(pair[1] as any)._data.type}, Size: ${(pair[1] as any)._data.size}`);
            fileFound = true;
        } else if (pair[0] === 'file') {
            console.log("'file' field found, but it's not a Blob or unexpected type.");
            fileFound = true;
        }
    }

    if (fileFound) {
        console.log("SUCCESS: 'file' field found in FormData!");
    } else {
        console.warn("WARNING: 'file' field NOT found in FormData!");
    }
    console.log("--- FormData Check Complete ---");

    try {
        console.log(`API Service: /user/${userId}/groupPersonalExperience`);

        console.log(formData);
        const response = await fetch(
            API.ADDRESS + `/user/${userId}/groupPersonalExperience`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${key}`,
                    //'Content-Type': 'application/json',
                },
                body: formData, // 'Content-Type: multipart/form-data'
            });

        const jsonResponse = await response.json();
        console.log("API Service: Response:", jsonResponse);

        if (!response.ok) {
            const errorMessage = jsonResponse.message || jsonResponse.error || `Error API: ${response.status} ${response.statusText}`;
            console.error("API Service: Wrong API call:", errorMessage);
            throw new Error(`API Response Error: ${errorMessage}`);
        }

        const userGroupPersonalExperience: string = jsonResponse.groupPersonalExperience;
        console.log("API Service: Trascription received:", userGroupPersonalExperience);

        return userGroupPersonalExperience;

    } catch (error: any) {
        console.error("API Service: Error:", error.message);
        throw error;
    }
}