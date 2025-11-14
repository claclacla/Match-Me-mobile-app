import {
    signIn as amplifySignIn, signOut as amplifySignOut,
    signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp,
    fetchAuthSession as amplifyFetchAuthSession
} from '@aws-amplify/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import useAuthenticationStore from '../repositories/localStorage/useAuthenticationStore';
import { getFirebaseToken } from '../repositories/api/getFirebaseToken';
import auth from '../config/firebase'; // Correctly imports the native auth instance

export function useAuthentication() {
    const setKey = useAuthenticationStore((state: any) => state.setKey);
    const unsetKey = useAuthenticationStore((state: any) => state.unsetKey);
    const setFirebaseToken = useAuthenticationStore((state: any) => state.setFirebaseToken);
    const unsetFirebaseToken = useAuthenticationStore((state: any) => state.unsetFirebaseToken);

    async function signUp({ username, password }: { username: string, password: string }) {
        try {
            const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
                username,
                password,
            });

            console.log('Sign up data:', { isSignUpComplete, userId, nextStep });

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                console.log('Waiting for the code');
                return { status: 'CONFIRM_REQUIRED', username: username };
            } else if (isSignUpComplete) {
                console.log('User registered!');
                return { status: 'COMPLETE' };
            }

        } catch (error: any) {
            if (error.name === 'UsernameExistsException') {
                throw new Error('This user already exists!');
            } else if (error.name === 'InvalidPasswordException') {
                throw new Error('Wrong password!');
            } else {
                console.error('SignUp error: ', error);
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

    // Updated return type to Promise<FirebaseAuthTypes.UserCredential | undefined>
    async function signIn({ username, password }: { username: string, password: string }): Promise<FirebaseAuthTypes.UserCredential | undefined> {
        try {
            await amplifySignIn({
                username,
                password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });

            const session = await amplifyFetchAuthSession();
            const cognitoIdToken = session.tokens?.idToken?.toString();
            console.log('Cognito ID Token:', cognitoIdToken);

            if (cognitoIdToken === undefined) {
                unsetKey();
                console.warn('Cognito ID Token is undefined after amplifySignIn. Returning undefined from signIn.');
                return undefined; // Comprehensive login failed
            } else {
                setKey(cognitoIdToken);

                // Attempt to get Firebase token and sign in to Firebase
                try {
                    const firebaseCustomToken = await getFirebaseToken({ key: cognitoIdToken });
                    console.log('Firebase custom token retrieved successfully.');

                    setFirebaseToken(firebaseCustomToken); // Store Firebase token in Zustand

                    try {
                        const userCredential = await auth.signInWithCustomToken(firebaseCustomToken);
                        console.log('Firebase authentication successful. User UID:', userCredential.user.uid);
                        return userCredential; // Return Firebase UserCredential on full success
                    } catch (firebaseAuthError: any) {
                        console.error('Failed to sign in to Firebase with custom token:', firebaseAuthError);
                        unsetFirebaseToken(); // Clear stored Firebase token if sign-in fails
                        return undefined; // Comprehensive login failed
                    }
                } catch (firebaseTokenError: any) {
                    console.error('Failed to get Firebase custom token from backend:', firebaseTokenError);
                    unsetFirebaseToken(); // Clear any stale Firebase token
                    return undefined; // Comprehensive login failed
                }
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
            console.error('Cognito signIn error:', error); // Log the original Cognito error
            throw new Error('Cognito authentication failed: ' + errorMessage); // Still throw for Cognito-specific failures
        }
    }

    // Updated return type to Promise<FirebaseAuthTypes.UserCredential | undefined>
    async function getIdTokenIfSignedIn(): Promise<FirebaseAuthTypes.UserCredential | undefined> {
        try {
            const session = await amplifyFetchAuthSession();
            const cognitoIdToken = session.tokens?.idToken?.toString();

            console.log("Cognito user key from session:" + cognitoIdToken);

            if (cognitoIdToken === undefined) {
                unsetKey();
                unsetFirebaseToken(); // Also clear Firebase token if Cognito session is gone
                console.warn('No Cognito ID token found in session. Returning undefined from getIdTokenIfSignedIn.');
                return undefined; // No Cognito session, so no Firebase session possible
            } else {
                setKey(cognitoIdToken);

                // Attempt to get Firebase token and sign in to Firebase
                try {
                    const firebaseCustomToken = await getFirebaseToken({ key: cognitoIdToken });
                    console.log('Firebase custom token retrieved successfully for existing session.');

                    setFirebaseToken(firebaseCustomToken); // Store Firebase token in Zustand

                    try {
                        const userCredential = await auth.signInWithCustomToken(firebaseCustomToken);
                        console.log('Firebase re-authentication successful for existing session. User UID:', userCredential.user.uid);
                        return userCredential; // Return Firebase UserCredential on full success
                    } catch (firebaseAuthError: any) {
                        console.error('Failed to re-sign in to Firebase with custom token for existing session:', firebaseAuthError);
                        unsetFirebaseToken(); // Clear stored Firebase token if sign-in fails
                        return undefined; // Comprehensive session check failed
                    }
                } catch (firebaseTokenError: any) {
                    console.error('Failed to get Firebase custom token from backend for existing session:', firebaseTokenError);
                    unsetFirebaseToken(); // Clear any stale Firebase token
                    return undefined; // Comprehensive session check failed
                }
            }
        } catch (error: any) {
            console.error("Error fetching Amplify session in getIdTokenIfSignedIn:", error);
            unsetKey(); // Clear Cognito key if session fetch fails
            unsetFirebaseToken(); // Clear Firebase token if session fetch fails
            return undefined; // Error occurred during session fetch, so comprehensive session check failed
        }
    }

    async function signOut() {
        try {
            // Sign out from Firebase first
            try {
                await auth.signOut(); // Correct usage of native auth.signOut()
                console.log('Firebase sign out successful');
            } catch (firebaseError: any) {
                console.error('Firebase sign out error:', firebaseError);
            }

            // Clear Firebase token from store
            unsetFirebaseToken();

            // Sign out from Cognito
            await amplifySignOut();

            // Clear Cognito token from store
            unsetKey();
            console.log('User signed out from Cognito and Firebase.');
        } catch (error: any) {
            console.error('Sign out error:', error);
            throw new Error('Error during sign out: ' + error.message);
        }
    }

    return {
        signUp,
        confirmSignUp,
        signIn,
        getIdTokenIfSignedIn,
        signOut
    }
}
