import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Configure Supabase client for Token Exchange pattern
// With this approach:
// 1. Cognito OIDC provider must be configured in Supabase Dashboard
// 2. After Cognito sign-in, call supabase.auth.signInWithIdToken()
// 3. Supabase creates users in auth.users table
// 4. RLS policies use auth.uid() (Supabase UUID)
// 5. Realtime works automatically (Supabase JWT has role: authenticated)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, // Store Supabase sessions
      autoRefreshToken: true, // Supabase handles token refresh
      detectSessionInUrl: false,
      storage: AsyncStorage, // Use AsyncStorage for React Native
    },
    realtime: { 
      params: { eventsPerSecond: 5 },
    },
  }
);


