import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingGroupBehaviorInsightsThankYouScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('MainNavigator', { screen: 'MainProfile' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Thank you!</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>You’ve drawn a shape that others can now approach.</Text>
                <Text style={styles.subtitle}>You’re not alone in what you’ve said.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupBehaviorInsightsThankYouScreen;