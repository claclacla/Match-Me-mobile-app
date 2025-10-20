import { API } from "../../config/config.json";

export async function setUserGroupPersonalExperienceFromText({
    key,
    userId,
    personalExperience
}: {
    key: string;
    userId: string;
    personalExperience: string;
}): Promise<string> {
    console.log("API Service: Sending text personal experience...");
    console.log("API Service: User ID:", userId);

    if (!personalExperience) {
        console.error("API Service: Error: Personal experience text is missing.");
        throw new Error("Personal experience text is missing. Cannot submit.");
    }

    try {
        console.log(`API Service: /user/${userId}/groupPersonalExperienceFromText`);
        
        const response = await fetch(
            API.ADDRESS + `/user/${userId}/groupPersonalExperienceFromText`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${key}`,
                },
                body: JSON.stringify({
                    personalExperience: personalExperience
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error("API Service: Error response:", errorData);
            throw new Error(`Failed to submit personal experience: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Service: Personal experience submitted successfully");
        
        return data.personalExperience || personalExperience;
    } catch (error) {
        console.error("API Service: Error submitting personal experience:", error);
        throw error;
    }
}

