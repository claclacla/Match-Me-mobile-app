import { ApplicationNavigationProp } from "../stackNavigationProps/ApplicationNavigationProp";

import { User } from "../repositories/globalEntities/User";

export async function useHandleSignInUserFlow({ navigation, user }: { navigation: ApplicationNavigationProp, user: User | undefined }) {

    // First onboarding step: Personal information

    if (user === undefined) {
        navigation.replace('OnboardingNavigator', { screen: "OnboardingPersonalInformation" });
    }

    // Second onboarding step: Insights -> groupBehavior

    else if (user.groupBehavior === "") {
        navigation.replace('OnboardingNavigator', { screen: "OnboardingInsightsCover" });
    }
    else {
        navigation.replace("MainNavigator", { screen: "MainProfile" });
    }
}