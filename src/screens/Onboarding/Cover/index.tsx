import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingCoverScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingPersonalInformation' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Hello!</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Breakice turns cultural exchange into real-life moments. </Text>

                <Text style={styles.subtitle}>Join small groups of locals and newcomers, share activities you love,</Text>
                <Text style={styles.subtitle}>and build friendships that last, right from your new city’s first hello.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingCoverScreen;