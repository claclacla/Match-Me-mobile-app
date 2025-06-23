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
    console.log(jsonResponse);

    const user: User = {
        id: jsonResponse.id,
        name: jsonResponse.name,
        gender: jsonResponse.gender,
        location: jsonResponse.location,
        age: jsonResponse.age,
        bio: jsonResponse.bio
    }

    return user;
}