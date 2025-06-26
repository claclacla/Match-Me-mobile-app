import { API } from "../../config/config.json";

import { User } from "../globalEntities/User";

// TO DO: Add the API input and output parameters

export async function insertUser({ key, user }: { key: string, user: User }) {
    console.log("Insert user:", key, user);
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