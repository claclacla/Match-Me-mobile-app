import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { fetchAuthSession } from '@aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables not loaded!');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ Missing');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ Missing');
  console.error('Make sure .env file exists in project root with EXPO_PUBLIC_ prefixed variables');
  throw new Error('Supabase environment variables are required. Please check your .env file.');
}

// Configure Supabase client to use Cognito tokens automatically
// This follows the Supabase Third Party Auth pattern for AWS Cognito
// See: https://supabase.com/docs/guides/auth/third-party/aws-cognito
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    // The accessToken function makes Supabase automatically use Cognito tokens for all requests
    // Following the Supabase Third Party Auth pattern for AWS Cognito
    accessToken: async () => {
      try {
        const session = await fetchAuthSession();
        // In Amplify v6, tokens are accessed via session.tokens
        // Prefer accessToken, fallback to idToken (both work with Supabase)
        const token = session?.tokens?.accessToken?.toString() || session?.tokens?.idToken?.toString() || '';
        return token;
      } catch (error) {
        console.warn('Failed to get Cognito token for Supabase:', error);
        return '';
      }
    },
    auth: {
      persistSession: false, // We're using Cognito sessions, not Supabase sessions
      autoRefreshToken: false, // Cognito handles token refresh
      detectSessionInUrl: false,
      storage: undefined, // Don't store Supabase sessions
    },
    realtime: { 
      params: { eventsPerSecond: 5 },
    },
  }
);

// Set up Hub listener for Cognito auth changes (required for Realtime)
// This ensures Supabase Realtime uses the latest Cognito token when auth state changes
Hub.listen('auth', async () => {
  try {
    const session = await fetchAuthSession();
    const token = session?.tokens?.accessToken?.toString() || session?.tokens?.idToken?.toString();
    if (token) {
      supabase.realtime.setAuth(token);
      console.log('✓ Updated Supabase Realtime auth token');
    }
  } catch (error) {
    console.warn('Failed to update Supabase Realtime auth token:', error);
  }
});


