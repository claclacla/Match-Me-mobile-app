import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// @react-native-firebase automatically initializes the default app
// when it reads google-services.json (Android) and GoogleService-Info.plist (iOS)
// The default app should be available automatically, so we can directly use auth()
// Export the auth instance - it will use the default app
export default auth();

