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
        })) },
    unsetUser: () => set((state: any) => ({ user: undefined }))
}));

export default useUserStore;