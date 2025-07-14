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

    console.log("Get user response: ", jsonResponse);

    const user: User = {
        id: jsonResponse.user.id,
        name: jsonResponse.user.name,
        surname: jsonResponse.user.surname,
        gender: jsonResponse.user.gender,
        country: jsonResponse.user.country,
        location: jsonResponse.user.location,
        languages: jsonResponse.user.languages,
        yearOfBirth: jsonResponse.user.yearOfBirth,
        groupProfile: jsonResponse.user.groupProfile,
        profileSectionsStatus: jsonResponse.user.profileSectionsStatus
    }

    return user;
}