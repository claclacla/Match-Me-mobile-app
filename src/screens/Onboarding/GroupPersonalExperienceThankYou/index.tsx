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

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Your voice is now part of this space.</Text>
                <Text style={styles.subtitle}>It brings depth to your presence.</Text>
                <Text style={styles.subtitle}>A feeling someone might meet, tomorrow or later on.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceThankYouScreen;