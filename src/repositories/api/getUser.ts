import { API } from "../../config/config.json";

import { User } from "../globalEntities/User";

// TO DO: Add the API input and output parameters

export async function getUser({ key }: { key: string }): Promise<undefined | User> {
    const response = await fetch(
        API.ADDRESS + '/user',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            }
        }
    );

    if (response.status === 404) {
        console.warn("User not found.");
        return undefined;
    }

    const jsonResponse = await response.json();

    const user: User = {
        id: jsonResponse.user.id,
        name: jsonResponse.user.name,
        gender: jsonResponse.user.gender,
        location: jsonResponse.user.location,
        age: jsonResponse.user.age,
        insights: jsonResponse.user.insights,
        narrative: jsonResponse.user.narrative
    }

    return user;
}