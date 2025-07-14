import { API } from "../../config/config.json";

// TO DO: Add the API input and output parameters

export async function setUserGroupBehavior({ key, userId, insights }: { key: string, userId: string, insights: string[] }) {
    console.log("Set user group behavior:", key, userId, insights);

    const response = await fetch(
        API.ADDRESS + `/user/${userId}/groupBehavior`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ insights })
        }
    );

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    const userGroupBehavior: string = jsonResponse.groupBehavior;

    return userGroupBehavior;
}