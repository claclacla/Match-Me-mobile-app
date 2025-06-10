import { create } from 'zustand';

const useAuthenticationStore = create((set) => ({
    key: "",
    setKey: (key: string) => set((state: any) => ({ key })),
    unsetKey: () => set((state: any) => ({ key: "" }))
}));

export default useAuthenticationStore;