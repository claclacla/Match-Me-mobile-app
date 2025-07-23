import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingGroupPersonalExperienceThankYouScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsCover' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Thank you!</Text>

            <Text style={styles.subtitle}>
                Your voice is now part of this space.
                It brings depth to your presence.
                A feeling someone might meet, tomorrow or later on.
            </Text>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceThankYouScreen;