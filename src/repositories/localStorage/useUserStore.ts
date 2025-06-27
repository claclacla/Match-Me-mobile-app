import { create } from 'zustand';

import { User } from '../globalEntities/User';

const useUserStore = create((set) => ({
    user: undefined,
    setUser: (user: User) => set((state: any) => ({ user })),
    unsetUser: () => set((state: any) => ({ user: undefined }))
}));

export default useUserStore;