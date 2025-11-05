import {
    signIn as amplifySignIn, signOut as amplifySignOut,
    signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp,
    fetchAuthSession as amplifyFetchAuthSession
} from '@aws-amplify/auth';

import { supabase } from '../repositories/supabase/supabaseClient';
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
            // Only log unexpected errors, not expected ones like user already exists
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

    async function signIn({ username, password }: { username: string, password: string }): Promise<string | undefined> {
        try {
            // 1. Sign in with Cognito
            await amplifySignIn({
                username,
                password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });

            // 2. Get Cognito ID token
            const session = await amplifyFetchAuthSession();
            const idToken = session.tokens?.idToken?.toString();
            
            if (idToken === undefined) {
                unsetKey();
                return;
            }

            console.log('✅ Cognito sign in successful');

            // 3. Exchange Cognito ID token for Supabase session
            // This requires Cognito to be configured as OIDC provider in Supabase Dashboard
            // See: OIDC_SETUP_GUIDE.md
            const { supabase } = await import('../repositories/supabase/supabaseClient');
            const { data: supabaseAuthData, error: supabaseAuthError } = await supabase.auth.signInWithIdToken({
                provider: 'cognito',
                token: idToken,
            });

            if (supabaseAuthError) {
                console.error('❌ Supabase token exchange failed:', supabaseAuthError);
                throw new Error(`Supabase authentication failed: ${supabaseAuthError.message}`);
            }

            if (!supabaseAuthData?.user) {
                throw new Error('Supabase authentication failed: No user returned');
            }

            console.log('✅ Supabase token exchange successful');
            console.log(`✅ Supabase user ID: ${supabaseAuthData.user.id}`);

            // Store Cognito ID token for backward compatibility (if needed)
            setKey(idToken);
            
            // Return Supabase user ID (not Cognito sub)
            return supabaseAuthData.user.id;
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

            throw new Error('Error: ' + errorMessage);
        }
    }

    async function getIdTokenIfSignedIn(): Promise<string | undefined> {
        try {
            // Check Supabase session first (token exchange approach)
            const { supabase } = await import('../repositories/supabase/supabaseClient');
            const { data: { session: supabaseSession } } = await supabase.auth.getSession();
            
            if (supabaseSession?.user) {
                console.log("✅ Supabase session found");
                console.log(`✅ Supabase user ID: ${supabaseSession.user.id}`);
                return supabaseSession.user.id;
            }

            // If no Supabase session, try to exchange Cognito token
            const session = await amplifyFetchAuthSession();
            const idToken = session.tokens?.idToken?.toString();

            if (idToken === undefined) {
                unsetKey();
                return;
            }

            console.log("✅ Cognito session found, exchanging for Supabase session...");
            
            // Exchange Cognito token for Supabase session
            const { data: supabaseAuthData, error: supabaseAuthError } = await supabase.auth.signInWithIdToken({
                provider: 'cognito',
                token: idToken,
            });

            if (supabaseAuthError) {
                console.error('❌ Supabase token exchange failed:', supabaseAuthError);
                throw new Error(`Supabase authentication failed: ${supabaseAuthError.message}`);
            }

            if (!supabaseAuthData?.user) {
                throw new Error('Supabase authentication failed: No user returned');
            }

            console.log('✅ Supabase token exchange successful');
            setKey(idToken);
            return supabaseAuthData.user.id;
        } catch (error) {
            console.error("Error fetching session:", error);
            unsetKey();
            throw new Error('Error: ' + error);
        }
    }

    async function signOut() {
        try {
            // Sign out from Supabase first
            const { supabase } = await import('../repositories/supabase/supabaseClient');
            await supabase.auth.signOut();
            
            // Then sign out from Cognito
            await amplifySignOut();
            unsetKey();
        } catch (error: any) {
            console.error('Sign out error:', error);
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