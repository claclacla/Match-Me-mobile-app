import { API } from "../../config/config.json";

import { User } from "../globalEntities/User";

// TO DO: Configure the API.ADDRESS 

export async function getUser({ key }: { key: string }) {
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

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    return jsonResponse;
}