import { Button, Layout, Text } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native";

import { ApplicationNavigationProp } from "../../../stackNavigationProps/ApplicationNavigationProp";

import styles from "../../../styles";

const OnboardingSendScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleComplete = async () => {
        navigation.replace('MainNavigator', { screen: "MainProfile" });
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Complete</Text>

            <Button
                style={styles.button}
                onPress={handleComplete}
            >
                Let's breakice!
            </Button>
        </Layout>
    );
}

export default OnboardingSendScreen;