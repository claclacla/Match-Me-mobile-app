import { create } from 'zustand';

import { User } from '../globalEntities/User';

const useUserStore = create((set) => ({
    user: undefined,
    setUser: (user: User) => set((state: any) => ({ user })),
    setUserGroupInsights: (insights: string[]) => {
        console.log("setUserGroupInsights: ", insights);
        set((state: any) => ({
            user: {
                ...state.user,
                groupProfile: {
                    ...state.user.groupProfile,
                    insights: insights,
                },
            },
        }))
    },
    setUserGroupPersonalExperience: (personalExperience: string) => {
        console.log("setUserGroupPersonalExperience: ", personalExperience);
        set((state: any) => ({
            user: {
                ...state.user,
                groupProfile: {
                    ...state.user.groupProfile,
                    personalExperience: {
                        description: personalExperience
                    }
                },
            },
        }))
    },
    unsetUser: () => set((state: any) => ({ user: undefined }))
}));

export default useUserStore;