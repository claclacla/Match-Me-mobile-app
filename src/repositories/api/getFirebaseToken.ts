import { API } from "../../config/config.json";

/**
 * Retrieves a Firebase custom token from the backend API.
 * The backend uses the Cognito user ID from the JWT to create a Firebase custom token.
 * 
 * @param key - The Cognito ID token (Bearer token) for authentication
 * @returns Promise<string> - The Firebase custom token
 * @throws Error if the request fails or the user is unauthorized
 */
export async function getFirebaseToken({ key }: { key: string }): Promise<string> {
    const response = await fetch(
        API.ADDRESS + '/firebase/token',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            }
        }
    );

    const jsonResponse = await response.json();

    console.log("Get Firebase token response status:", response.status);
    console.log("Get Firebase token response:", jsonResponse);

    // Handle error responses
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: User ID not found in token.');
        } else if (response.status === 400) {
            throw new Error(jsonResponse.message || 'Invalid argument for token creation.');
        } else if (response.status === 500) {
            throw new Error(jsonResponse.message || 'Firebase internal error occurred.');
        } else {
            throw new Error(jsonResponse.message || `Failed to get Firebase token: ${response.status}`);
        }
    }

    // Extract and return the Firebase token
    if (!jsonResponse.firebaseToken) {
        throw new Error('Firebase token not found in response.');
    }

    return jsonResponse.firebaseToken;
}

