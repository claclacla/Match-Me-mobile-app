import { ApplicationNavigationProp } from "../stackNavigationProps/ApplicationNavigationProp";

import { PROFILE_SECTION_STATUS, User } from "../repositories/globalEntities/User";

export async function useHandleSignInUserFlow({ navigation, user }: { navigation: ApplicationNavigationProp, user: User | undefined }) {

    // First onboarding step: Personal information

    if (user === undefined) {
        navigation.replace('OnboardingNavigator', { screen: "OnboardingPersonalInformation" });
    }
    else {
        console.log("useHandleSignInUserFlow: User profile sections status: ", user.profileSectionsStatus);

        if (user.profileSectionsStatus.avatar === PROFILE_SECTION_STATUS.PENDING) {
            navigation.replace('OnboardingNavigator', { screen: "OnboardingUploadAvatar" });
        }
        else if (user.profileSectionsStatus.groupPersonalExperience === PROFILE_SECTION_STATUS.PENDING) {
            navigation.replace('OnboardingNavigator', { screen: "OnboardingGroupPersonalExperienceCover" });
        }
        else if (user.profileSectionsStatus.groupBehavior === PROFILE_SECTION_STATUS.PENDING) {
            navigation.replace('OnboardingNavigator', { screen: "OnboardingGroupBehaviorInsightsCover" });
        }

        // TO DO: Add the other profile sections check here ... ...

        else {
            navigation.replace("MainNavigator", { screen: "MainProfile" });
        }
    }
}