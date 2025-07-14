// TO DO: The following parameters have to be passed from a API. Currently this file is an UserDTO copy. 

export type UserGender = 'male' | 'female' | 'not_binary' | 'prefer_not_to_say';

export const PROFILE_SECTION_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    SKIPPED: "skipped"
} as const;

export type ProfileSectionStatus = typeof PROFILE_SECTION_STATUS[keyof typeof PROFILE_SECTION_STATUS];

export const GENDER_OPTIONS = [
    { label: 'Uomo', value: 'male' as UserGender },
    { label: 'Donna', value: 'female' as UserGender },
    { label: 'Non binario', value: 'non_binary' as UserGender },
    { label: 'Preferisco non specificare', value: 'prefer_not_to_say' as UserGender },
];

export const DEFAULT_GENDER: UserGender = 'prefer_not_to_say';

export interface User {
    id: string,                 // The Cognito user's id
    name: string,
    surname: string,
    gender: UserGender,
    country: string,
    location: string,
    yearOfBirth: number,
    languages: string[],
    groupProfile: {
        insights: string[],
        behavior: string
    },
    match?: {
        id: string,
    },
    profileSectionsStatus: {
        personalInformation: ProfileSectionStatus,
        avatar: ProfileSectionStatus,
        groupBehavior: ProfileSectionStatus,
        voiceprint: ProfileSectionStatus
    }
}

export function initUser({ name, surname, gender, country, location, yearOfBirth, languages }: {
    name: string, surname: string, gender: UserGender, country: string, location: string, yearOfBirth: number, languages: string[]
}) {
    const user: User = {
        id: "",
        name,
        surname,
        gender,
        country,
        location,
        yearOfBirth,
        languages,
        groupProfile: {
            insights: [],
            behavior: ""
        },
        profileSectionsStatus: {
            personalInformation: "pending",
            avatar: "pending",
            groupBehavior: "pending",
            voiceprint: "pending"
        }
    }

    return user;
}