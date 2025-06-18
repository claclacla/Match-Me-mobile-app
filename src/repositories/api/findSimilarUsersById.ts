import { API } from "../../config/config.json";

// TO DO: Configure the API.ADDRESS  

export async function findSimilarUsersById({ key }: { key: string }) {
    const response = await fetch(
        /*API.ADDRESS +*/ 'https://6ynugcy0be.execute-api.eu-west-1.amazonaws.com/dev/findSimilarUsersById?targetId=user_002&topK=3',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
        }
    );

    const jsonResponse = await response.json();

    return jsonResponse;
}