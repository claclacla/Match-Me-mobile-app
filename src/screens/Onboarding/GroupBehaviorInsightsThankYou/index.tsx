import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingGroupBehaviorInsightsThankYouScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('MatcherNavigator', { screen: 'MatcherAdventureSelector' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Thank you for sharing your story with us.</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Your openness helps us build a space where real connections can grow, and we ask everyone to approach interactions with kindness.</Text>
                <Text style={styles.subtitle}>At Breakice, trust, safety, and respect are at the heart of everything we do, and we believe beautiful things happen when people feel safe and seen.</Text>
                <Text style={styles.subtitle}>We're excited to see the connections you'll create. Welcome aboard!</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupBehaviorInsightsThankYouScreen;