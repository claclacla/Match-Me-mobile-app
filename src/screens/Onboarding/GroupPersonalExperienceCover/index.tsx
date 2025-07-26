import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingGroupPersonalExperienceCoverScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupPersonalExperienceIntro' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>You’re in a space where attention matters.</Text>
                <Text style={styles.subtitle}>Where being heard comes before being seen.</Text>
                <Text style={styles.subtitle}>What follows isn’t about being right</Text>
                <Text style={styles.subtitle}>It’s about being real.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceCoverScreen;