import { signIn as amplifySignIn, signOut as amplifySignOut, fetchAuthSession as amplifyFetchAuthSession } from '@aws-amplify/auth';

import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';

export function useAuthentication() {
    const setKey = useAuthenticationStore((state: any) => state.setKey);
    const unsetKey = useAuthenticationStore((state: any) => state.unsetKey);

    async function signIn({ username, password }: { username: string, password: string }) {
        try {
            await amplifySignIn({
                username,
                password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });

            const session = await amplifyFetchAuthSession();
            const key = session.tokens?.idToken?.toString();

            if (key === undefined) {
                unsetKey();
                return;
            }
            else {
                setKey(key);
            }
        } catch (error: any) {
            let errorMessage = 'Error';

            if (error.name === 'UserNotFoundException') {
                errorMessage = 'Username not found!';
            } else if (error.name === 'NotAuthorizedException') {
                errorMessage = 'Username or password error!';
            } else if (error.name === 'UserNotConfirmedException') {
                errorMessage = 'User not confirmed. Check your email!';
            } else {
                errorMessage = error.message || errorMessage;
            }

            throw new Error('Error: ' + error);
        }
    }

    async function signOut() {
        try {
            await amplifySignOut();
        } catch (error: any) {
            console.error('Sign out error:', error);
        }
    }

    return {
        signIn,
        signOut
    }
}