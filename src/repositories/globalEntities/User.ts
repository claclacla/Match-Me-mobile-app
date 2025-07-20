// TO DO: The following parameters have to be passed from a API. Currently this file is an UserDTO copy. 

export type UserGender = 'male' | 'female' | 'not_binary' | 'prefer_not_to_say';

export const GENDER_OPTIONS = [
    { label: 'Uomo', value: 'male' as UserGender },
    { label: 'Donna', value: 'female' as UserGender },
    { label: 'Non binario', value: 'non_binary' as UserGender },
    { label: 'Preferisco non specificare', value: 'prefer_not_to_say' as UserGender },
];

export const DEFAULT_GENDER: UserGender = 'prefer_not_to_say';

export const PROFILE_SECTION_KEYS = {
    PERSONAL_INFORMATION: "personalInformation",
    AVATAR: "avatar",
    GROUP_BEHAVIOR: "groupBehavior",
    VOICEPRINT: "voiceprint"
} as const;

export type ProfileSectionKey = typeof PROFILE_SECTION_KEYS[keyof typeof PROFILE_SECTION_KEYS];

export const PROFILE_SECTION_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    SKIPPED: "skipped"
} as const;

export type ProfileSectionStatus = typeof PROFILE_SECTION_STATUS[keyof typeof PROFILE_SECTION_STATUS];

export interface LocationData {
    name: string, 
    lat: number,
    lng: number
}

export interface User {
    id: string,                 // The Cognito user's id
    name: string,
    surname: string,
    gender: UserGender,
    country?: string,
    location: LocationData,
    yearOfBirth: number,
    languages: string[],
    avatar?: string,
    groupProfile: {
        insights: string[],
        behavior: string
    },
    match?: {
        id: string,
    },
    profileSectionsStatus: Record<ProfileSectionKey, ProfileSectionStatus>
}

export function initUser({ name, surname, gender, country, location, yearOfBirth, languages }: {
    name: string, surname: string, gender: UserGender, country?: string, location: LocationData, yearOfBirth: number, languages: string[]
}) {
    const user: User = {
        id: "",
        name,
        surname,
        gender,
        location,
        yearOfBirth,
        languages,
        groupProfile: {
            insights: [],
            behavior: ""
        },
        profileSectionsStatus: {
            [PROFILE_SECTION_KEYS.PERSONAL_INFORMATION]: PROFILE_SECTION_STATUS.PENDING,
            [PROFILE_SECTION_KEYS.AVATAR]: PROFILE_SECTION_STATUS.PENDING,
            [PROFILE_SECTION_KEYS.GROUP_BEHAVIOR]: PROFILE_SECTION_STATUS.PENDING,
            [PROFILE_SECTION_KEYS.VOICEPRINT]: PROFILE_SECTION_STATUS.PENDING
        }
    }

    if (country !== undefined) {
        user.country = country;
    }

    return user;
}