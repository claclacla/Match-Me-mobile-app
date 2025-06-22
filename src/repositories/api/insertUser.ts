import { API } from "../../config/config.json";

import { User } from "../globalEntities/User";

// TO DO: Configure the API.ADDRESS 

export async function insertUser({ key, user }: { key: string, user: User }) {
    const response = await fetch(
        API.ADDRESS + '/user',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        }
    );

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    return jsonResponse;
}