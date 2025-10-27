import { ApplicationNavigationProp } from "../stackNavigationProps/ApplicationNavigationProp";

import { PROFILE_SECTION_STATUS, User } from "../repositories/globalEntities/User";

export async function useHandleSignInUserFlow({ navigation, user }: { navigation: ApplicationNavigationProp, user: User | undefined }) {

    // First signup step: Personal information

    if (user === undefined) {
        navigation.replace('SigninSignupNavigator', { screen: "SigninSignupBasicInfo" });
    }
    else {
        console.log("useHandleSignInUserFlow: User profile sections status: ", user.profileSectionsStatus);

        if (user.profileSectionsStatus.avatar === PROFILE_SECTION_STATUS.PENDING) {
            navigation.replace('SigninSignupNavigator', { screen: "SigninSignupUploadAvatar" });
        }
        else if (user.profileSectionsStatus.groupPersonalExperience === PROFILE_SECTION_STATUS.PENDING) {
            navigation.replace('SigninSignupNavigator', { screen: "SigninSignupVoiceRecording" });
        }

        else {
            // Check if user has completed the insights quiz
            if (user.profileSectionsStatus.groupInsights === PROFILE_SECTION_STATUS.COMPLETED) {
                // User has completed onboarding, redirect to main app
                navigation.replace('MainNavigator', { screen: "MainHome" });
            } else {
                // User hasn't completed insights quiz, redirect to onboarding
                navigation.replace('OnboardingNavigator', { screen: "OnboardingFork" });
            }
        }
    }
}