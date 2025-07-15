import { Button, Layout, Text } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native";

import { ApplicationNavigationProp } from "../../../stackNavigationProps/ApplicationNavigationProp";

import { setUserGroupBehavior } from "../../../repositories/api/setUserGroupBehavior";

import { User } from "../../../repositories/globalEntities/User";

import useUserStore from "../../../repositories/localStorage/useUserStore";
import useAuthenticationStore from "../../../repositories/localStorage/useAuthenticationStore";

import styles from "../../../styles";

const OnboardingSendScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);
    const setUser = useUserStore((state: any) => state.setUser);

    const handleInsertUser = async () => {
        console.log(user);
        user.groupProfile.behavior = await setUserGroupBehavior({ key, userId: user.id, insights: user.groupProfile.insights });

        setUser(user);

        navigation.replace('MainNavigator', { screen: "MainProfile" });
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Send</Text>

            <Button
                style={styles.button}
                onPress={handleInsertUser}
            >
                Send
            </Button>
        </Layout>
    );
}

export default OnboardingSendScreen;