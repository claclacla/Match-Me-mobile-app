import { useNavigation } from "@react-navigation/native";

import { ApplicationNavigationProp } from "../stackNavigationProps/ApplicationNavigationProp";

import { User } from "../repositories/globalEntities/User";
import { getUser } from "../repositories/api/getUser";

export async function useHandleSignInUserFlow({ navigation, key }: { navigation: ApplicationNavigationProp, key: string }) {
    console.log("Handling sign in user flow...");
    
    const user: User | undefined = await getUser({ key });

    if (user === undefined) {
        navigation.replace('Onboarding');
    }
    else {
        navigation.replace("MainNavigator", { screen: "MainProfile" });
    }
}