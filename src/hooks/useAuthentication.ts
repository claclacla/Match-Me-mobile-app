import {
    signIn as amplifySignIn, signOut as amplifySignOut,
    signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp,
    fetchAuthSession as amplifyFetchAuthSession
} from '@aws-amplify/auth';

import useAuthenticationStore from '../repositories/localStorage/useAuthenticationStore';

export function useAuthentication() {
    const setKey = useAuthenticationStore((state: any) => state.setKey);
    const unsetKey = useAuthenticationStore((state: any) => state.unsetKey);

    async function signUp({ username, password }: { username: string, password: string }) {
        try {
            const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
                username,
                password,
            });

            console.log('Sign up data:', { isSignUpComplete, userId, nextStep });

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                console.log('Waiting for the code');
                // A questo punto, dovresti reindirizzare l'utente a una schermata di conferma
                // dove inserirà il codice ricevuto via email/SMS.
                return { status: 'CONFIRM_REQUIRED', username: username };
            } else if (isSignUpComplete) {
                console.log('User registered!');
                return { status: 'COMPLETE' };
            }

        } catch (error: any) {
            console.error('Error: ', error);

            if (error.name === 'UsernameExistsException') {
                throw new Error('This user already exists!');
            } else if (error.name === 'InvalidPasswordException') {
                throw new Error('Wrong password!');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    }

    async function confirmSignUp({ username, confirmationCode }: { username: string, confirmationCode: string }) {
        try {
            const { isSignUpComplete, nextStep } = await amplifyConfirmSignUp({
                username,
                confirmationCode,
            });

            console.log('User confirmed:', { isSignUpComplete, nextStep });

            if (isSignUpComplete) {
                console.log('The user has been registered');
                return { status: 'COMPLETE' };
            } else {
                console.log('Confirmation not completed: ', nextStep);
                return { status: 'INCOMPLETE', nextStep: nextStep };
            }

        } catch (error: any) {
            console.error('Error:', error);

            if (error.name === 'CodeMismatchException') {
                throw new Error('Wrong validation code');
            } else if (error.name === 'ExpiredCodeException') {
                throw new Error('Validation code expired');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    }

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
        signUp,
        confirmSignUp,
        signIn,
        signOut
    }
}