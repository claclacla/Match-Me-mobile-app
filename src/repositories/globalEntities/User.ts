// TO DO: The following parameters have to be passed from a API. Currently this file is an UserDTO copy. 

export type UserGender = 'male' | 'female' | 'not_binary' | 'prefer_not_to_say';

export const GENDER_OPTIONS = [
    { label: 'Uomo', value: 'male' as UserGender },
    { label: 'Donna', value: 'female' as UserGender },
    { label: 'Non binario', value: 'non_binary' as UserGender },
    { label: 'Preferisco non specificare', value: 'prefer_not_to_say' as UserGender },
];

export const DEFAULT_GENDER: UserGender = 'prefer_not_to_say';

export interface User {
    id: string,
    name: string,
    gender: UserGender,
    location: string,
    yearOfBirth: number,
    languages: string[],
    insights: string[],
    groupBehavior: string,
    match?: {
        id: string,
    }
}

export function initUser({ name, gender, location, yearOfBirth, languages }: {
    name: string, gender: UserGender, location: string, yearOfBirth: number, languages: string[]
}) {
    const user: User = {
        id: "",
        name,
        gender,
        location,
        yearOfBirth,
        languages,
        insights: [],
        groupBehavior: ""
    }

    return user;
}