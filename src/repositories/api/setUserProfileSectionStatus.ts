import { API } from "../../config/config.json";
import { PROFILE_SECTION_STATUS } from "../globalEntities/User";

// TO DO: Add the API input and output parameters

export async function setUserProfileSectionStatus({ key, userId, section, value }:
    { key: string, userId: string, section: string, value: string }): Promise<boolean> {
    console.log("Set user profile section status:", key, userId, section, value);

    const allowedValues: string[] = Object.values(PROFILE_SECTION_STATUS);

    if (!allowedValues.includes(value)) {
        return false;
    }

    const response = await fetch(
        `${API.ADDRESS}/user/${userId}/profileSectionStatus`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                section,
                value
            }),
        }
    );

    if (!response.ok) {
        console.error(`Failed to update status. HTTP ${response.status}`);
        return false;
    }

    const jsonResponse = await response.json();
    const success = jsonResponse.value === value;

    if (success) {
        console.log("Profile section status updated successfully.");
    } else {
        console.warn("Profile section status update mismatch.");
    }

    return success;
}