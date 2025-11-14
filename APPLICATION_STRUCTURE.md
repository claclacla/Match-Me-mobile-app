# Match-Me Mobile App - Application Structure & Authentication Overview

## Overview
This is a React Native mobile application built with **Expo**, using **UI Kitten** for the UI components and **Zustand** for state management. The app is currently using **AWS Amplify** with **AWS Cognito** for authentication, but you're in the process of migrating to **Firebase**.

## Technology Stack
- **Framework**: React Native with Expo (~53.0.10)
- **UI Library**: UI Kitten (@ui-kitten/components) with Eva Design System
- **State Management**: Zustand
- **Navigation**: React Navigation (Stack Navigator)
- **Authentication**: AWS Amplify/Cognito (migrating to Firebase)
- **Backend API**: REST API at `https://api.breakice.social`
- **Language**: TypeScript

## Application Architecture

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── AdventureCard/
│   ├── LanguageSelector/
│   ├── PhoneNumberInput/
│   └── UsernameInput/
├── config/             # Configuration files
│   └── config.json     # API endpoints and external service keys
├── hooks/              # Custom React hooks
│   ├── useAuthentication.ts        # Authentication operations
│   └── useHandleSignInUserFlow.ts  # Navigation flow logic after auth
├── repositories/       # Data layer
│   ├── api/            # API calls to backend
│   ├── globalEntities/ # TypeScript types/models
│   └── localStorage/   # Zustand stores for local state
├── screens/            # Screen components organized by feature
│   ├── SplashScreen/
│   ├── IntroductionCarousel/
│   ├── InitScreen/     # Authentication check & routing
│   ├── SigninSignup/   # Authentication & profile setup
│   ├── Onboarding/     # Post-signup onboarding flow
│   └── Main/           # Main app screens
├── screensList/        # TypeScript navigation type definitions
└── stackNavigationProps/ # Navigation prop types
```

## Authentication Flow

### Current Implementation (AWS Cognito)

#### 1. **Authentication Hook** (`src/hooks/useAuthentication.ts`)
The `useAuthentication` hook provides the following functions:

- **`signUp({ username, password })`**: 
  - Registers a new user with AWS Cognito
  - Returns `{ status: 'CONFIRM_REQUIRED', username }` if email/SMS confirmation is needed
  - Returns `{ status: 'COMPLETE' }` if signup is complete
  - Uses phone numbers as usernames (format: `+[country code][number]`)

- **`confirmSignUp({ username, confirmationCode })`**:
  - Confirms user registration with verification code
  - Returns `{ status: 'COMPLETE' }` on success

- **`signIn({ username, password })`**:
  - Authenticates user with AWS Cognito
  - Fetches ID token from session
  - Stores token in Zustand store (`useAuthenticationStore`)
  - Returns the ID token string or `undefined` on failure
  - Uses `USER_PASSWORD_AUTH` flow type

- **`getIdTokenIfSignedIn()`**:
  - Checks if user has an active session
  - Returns ID token if authenticated, `undefined` otherwise
  - Updates Zustand store with token

- **`signOut()`**:
  - Signs out user from AWS Cognito

#### 2. **Authentication Store** (`src/repositories/localStorage/useAuthenticationStore.ts`)
- Zustand store that holds the authentication token (ID token)
- Methods: `setKey(key)`, `unsetKey()`
- Token is stored in memory (not persisted to AsyncStorage)

#### 3. **User Store** (`src/repositories/localStorage/useUserStore.ts`)
- Zustand store that holds the current user object
- Methods: 
  - `setUser(user)`: Sets the complete user object
  - `setUserGroupInsights(insights)`: Updates user's group insights
  - `setUserGroupPersonalExperience(description)`: Updates personal experience
  - `unsetUser()`: Clears user data

### Application Flow

#### **Entry Point** (`App.tsx`)
1. Configures AWS Amplify with credentials from `src/aws-exports.js`
2. Sets up React Navigation with stack navigator
3. Initial route: `SplashScreen`

#### **Navigation Flow**

```
SplashScreen
    ↓
IntroductionCarousel (first launch only)
    ↓
InitScreen (authentication check)
    ↓
    ├─→ SigninSignupNavigator (if not authenticated)
    │       ├─→ SigninSignupMain (login/signup)
    │       ├─→ SigninSignupConfirmation (verify code)
    │       ├─→ SigninSignupBasicInfo (name, surname, etc.)
    │       ├─→ SigninSignupPersonalDetails (gender, birth year, languages)
    │       ├─→ SigninSignupLocation (location selection)
    │       ├─→ SigninSignupUploadAvatar (profile picture)
    │       ├─→ SigninSignupVoiceRecording (voice recording)
    │       └─→ SigninSignupSignupOutro (completion)
    │
    └─→ OnboardingNavigator (if authenticated but onboarding incomplete)
    │       ├─→ OnboardingFork
    │       ├─→ HowItWorks
    │       └─→ InsightsQuiz
    │
    └─→ MainNavigator (if fully onboarded)
            └─→ MainHome
```

#### **InitScreen** (`src/screens/InitScreen/index.tsx`)
This is the **authentication router** that determines where to send the user:

1. Calls `getIdTokenIfSignedIn()` to check for active session
2. If no token → Navigate to `SigninSignupMain`
3. If token exists:
   - Fetches user data from API using `getUser({ key })`
   - Stores user in Zustand store
   - Calls `useHandleSignInUserFlow()` to determine next screen

#### **Sign-In User Flow Handler** (`src/hooks/useHandleSignInUserFlow.ts`)
This function routes users based on their profile completion status:

1. **If `user === undefined`**: 
   - User doesn't exist in backend → Navigate to `SigninSignupBasicInfo`

2. **If user exists, check `profileSectionsStatus`**:
   - `avatar === PENDING` → Navigate to `SigninSignupUploadAvatar`
   - `groupPersonalExperience === PENDING` → Navigate to `SigninSignupVoiceRecording`
   - `groupInsights === COMPLETED` → Navigate to `MainNavigator` (fully onboarded)
   - Otherwise → Navigate to `OnboardingNavigator` (needs insights quiz)

### User Data Model

#### **User Interface** (`src/repositories/globalEntities/User.ts`)
```typescript
interface User {
    id: string;                    // Cognito user ID (will be Firebase UID)
    name: string;
    surname: string;
    gender: UserGender;            // 'male' | 'female' | 'not_binary' | 'prefer_not_to_say'
    country?: string;
    location?: LocationData;       // { name, lat, lng }
    yearOfBirth: number;
    languages: string[];
    avatar?: string;               // URL to avatar image
    groupProfile: {
        insights?: string[];
        personalExperience?: {
            description: string
        };
        behavior?: {
            description: string;
            factors: GroupBehaviorFactors;
        }
    };
    match?: {
        id: string;
    };
    profileSectionsStatus: Record<ProfileSectionKey, ProfileSectionStatus>
}
```

#### **Profile Section Status**
Tracks completion of different profile sections:
- `personalInformation`: PENDING | COMPLETED | SKIPPED
- `avatar`: PENDING | COMPLETED | SKIPPED
- `groupPersonalExperience`: PENDING | COMPLETED | SKIPPED
- `groupInsights`: PENDING | COMPLETED | SKIPPED

### API Integration

#### **Backend API** (`src/config/config.json`)
- Base URL: `https://api.breakice.social`
- All API calls require Bearer token authentication

#### **API Functions** (`src/repositories/api/`)
- **`getUser({ key })`**: 
  - GET `/user`
  - Headers: `Authorization: Bearer ${key}`
  - Returns `User` object or `undefined` if 404

- **`insertUser({ key, user })`**: 
  - POST `/user`
  - Headers: `Authorization: Bearer ${key}`
  - Body: User object
  - Returns user with assigned ID

- **`uploadUserAvatar({ key, ... })`**: Uploads avatar image
- **`setUserGroupInsights({ key, ... })`**: Updates group insights
- **`setUserGroupPersonalExperienceFromText({ key, ... })`**: Updates experience from text
- **`setUserGroupPersonalExperienceFromVoice({ key, ... })`**: Updates experience from voice
- **`setUserProfileSectionStatus({ key, ... })`**: Updates profile section status

### Sign-Up/Sign-In Process

#### **Sign-Up Flow** (`src/screens/SigninSignup/Main/index.tsx`)
1. User enters phone number (with country code) and password
2. App attempts `signUp()` first
3. If user already exists → Attempts `signIn()` instead
4. If new user → Navigates to `SigninSignupConfirmation` for code verification
5. If existing user → Fetches user data and routes via `useHandleSignInUserFlow()`

#### **Sign-Up Steps** (after confirmation)
1. **BasicInfo**: Name, surname
2. **PersonalDetails**: Gender, birth year, languages
3. **Location**: Country and location selection
4. **UploadAvatar**: Profile picture upload
5. **VoiceRecording**: Voice recording for personal experience
6. **SignupOutro**: Completion screen

#### **Onboarding Steps** (after signup)
1. **OnboardingFork**: Entry point
2. **HowItWorks**: Explanation screen
3. **InsightsQuiz**: Quiz to determine group insights

## Migration to Firebase Context

### Current State
- **Authentication**: AWS Cognito via AWS Amplify
- **User ID**: Cognito User ID stored in `user.id`
- **Token**: AWS Cognito ID Token stored in Zustand store
- **API Auth**: Bearer token authentication using ID token

### What Needs to Change for Firebase

1. **Authentication Hook** (`useAuthentication.ts`):
   - Replace AWS Amplify functions with Firebase Auth
   - `signUp()` → `createUserWithEmailAndPassword()` or phone auth
   - `signIn()` → `signInWithEmailAndPassword()` or phone auth
   - `confirmSignUp()` → Phone verification or email verification
   - `getIdTokenIfSignedIn()` → `auth.currentUser?.getIdToken()`
   - `signOut()` → `signOut(auth)`

2. **Token Management**:
   - Firebase ID tokens work similarly to Cognito tokens
   - Can still use Bearer token authentication with backend
   - Token refresh: Firebase handles automatic token refresh

3. **User ID**:
   - Replace Cognito User ID with Firebase UID (`user.uid`)
   - Update `User.id` field to use Firebase UID

4. **Configuration**:
   - Replace `aws-exports.js` with Firebase config
   - Update `Amplify.configure()` in `App.tsx` with Firebase initialization

5. **Phone Authentication**:
   - Current app uses phone numbers as usernames
   - Firebase supports phone authentication via `signInWithPhoneNumber()`
   - Verification code flow is similar to current implementation

### Key Points for Firebase Migration

- **User Flow**: The navigation flow and user routing logic (`useHandleSignInUserFlow`) should remain the same
- **API Integration**: Backend API expects Bearer tokens - Firebase ID tokens work the same way
- **State Management**: Zustand stores can remain unchanged (just different token source)
- **Profile Sections**: The profile completion tracking system is independent of auth provider

## Important Files for Firebase Migration

1. **`src/hooks/useAuthentication.ts`** - Main authentication logic
2. **`App.tsx`** - Amplify configuration (line 16-19)
3. **`src/aws-exports.js`** - AWS config (replace with Firebase config)
4. **`src/repositories/api/getUser.ts`** - Uses token for API calls
5. **`src/screens/InitScreen/index.tsx`** - Authentication check on app start
6. **`src/screens/SigninSignup/Main/index.tsx`** - Sign-up/sign-in UI

## Notes

- The app uses **phone numbers** as the primary authentication method (not email)
- Password requirements: Minimum 6 characters (enforced by Cognito, may differ in Firebase)
- User data is stored in a separate backend database, not in Cognito/Firebase user attributes
- The app has a multi-step onboarding process that tracks completion via `profileSectionsStatus`
- All API calls require the ID token in the Authorization header

