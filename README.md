# Match me! (Mobile app)

The app has been initialized using `Expo`, and the user interface is built with `UI Kitten`.
The state management is based on `Zustand`.

--------------------------------------------------------------------------------

## Status and TO DO


--------------------------------------------------------------------------------

## Initialization

```bash

npx create-expo-app MatchApp

cd MatchApp
npx expo install @ui-kitten/components @eva-design/eva react-native-svg

```

## Development

```bash

npx expo start

```


--------------------------------------------------------------------------------

## Authors

- **Simone Adelchino** - 
 
--------------------------------------------------------------------------------

## Environment variables

Create a `.env` file in the project root with the following variables (Expo will inline variables prefixed with `EXPO_PUBLIC_` at build time):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://lqiwlmhoykdnrxvvwcuw.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaXdsbWhveWtkbnJ4dnZ3Y3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDUwMjIsImV4cCI6MjA3NzQyMTAyMn0.1uQgFQwNWOp6YnkRxNU63AumvQMKGkCChXV1jwic_ew
```

Notes:
- **Naming**: Only variables prefixed with `EXPO_PUBLIC_` are exposed to the app.
- **Security**: The anon key is safe for client usage but still treat it as a credential; avoid committing `.env` if your `.gitignore` allows.

--------------------------------------------------------------------------------

## Authentication and Chat Backend

**🔐 Authentication and Chat Backend**

The app uses Amazon Cognito for user authentication and Supabase as the real-time chat backend.

- **Sign-in**: Users authenticate with Cognito.

- **Session exchange**: After login, the app sends the Cognito ID token to Supabase through the OIDC integration. Supabase verifies the token and issues its own session, letting the app access data securely.

- **Realtime chat**: The app connects to Supabase to read and post messages. Each user can only access chat rooms they belong to, enforced by Supabase Row Level Security (RLS).

- **Backend agent**: A Python service in AWS (using the Supabase service-role key) creates chat rooms and memberships for each user group during onboarding.

This architecture provides single sign-on via Cognito, secure database access via Supabase, and live chat updates without running a custom WebSocket server.