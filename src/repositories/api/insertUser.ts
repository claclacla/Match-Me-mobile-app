import { API } from "../../config/config.json";

import { User } from "../globalEntities/User";

// TO DO: Configure the API.ADDRESS 

export async function insertUser({ key, user }: { key: string, user: User }) {
    const response = await fetch(
        /*API.ADDRESS +*/ 'https://let6dx6nyk.execute-api.eu-west-1.amazonaws.com/dev/user',
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