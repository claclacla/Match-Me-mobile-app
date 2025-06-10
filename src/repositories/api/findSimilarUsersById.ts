import { API } from "../../config/config.json";

export async function findSimilarUsersById({ key }: { key: string }) {
    const response = await fetch(
        API.ADDRESS + 'findSimilarUsersById?targetId=user_002&topK=3',
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