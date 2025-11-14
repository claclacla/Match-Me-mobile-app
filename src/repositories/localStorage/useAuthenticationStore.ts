import { create } from 'zustand';

const useAuthenticationStore = create((set) => ({
    key: "", // Cognito ID token
    firebaseToken: "", // Firebase custom token
    setKey: (key: string) => set((state: any) => ({ key })),
    unsetKey: () => set((state: any) => ({ key: "", firebaseToken: "" })),
    setFirebaseToken: (firebaseToken: string) => set((state: any) => ({ firebaseToken })),
    unsetFirebaseToken: () => set((state: any) => ({ firebaseToken: "" }))
}));

export default useAuthenticationStore;