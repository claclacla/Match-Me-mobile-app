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
            <Text style={styles.title}>Thank you for sharing your story and your time with us.</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Your openness helps us build a space where real connections can grow.</Text>
                <Text style={styles.subtitle}>At Breakice, trust, safety, and respect are at the heart of everything we do.</Text>
                <Text style={styles.subtitle}>We ask all members to approach each interaction with kindness and empathy, whether you're chatting, meeting in person, or planning something together.</Text>
                <Text style={styles.subtitle}>Please help us uphold these values by treating everyone with care and consideration.</Text>
                <Text style={styles.subtitle}>We truly believe that when people feel safe and seen, beautiful things can happen.</Text>
                <Text style={styles.subtitle}>We’re excited to see the connections you’ll create.</Text>
                <Text style={styles.subtitle}>Welcome aboard.</Text>
                <Text style={styles.subtitle}>With love,</Text>
                <Text style={styles.subtitle}>The Breakice Team</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupBehaviorInsightsThankYouScreen;