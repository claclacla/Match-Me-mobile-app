import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const OnboardingGroupPersonalExperienceIntroScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = async () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupPersonalExperienceRecording' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Your voice, if you want</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Next, you'll see a screen where you can leave a short voice message, just one minute, no script, no pressure.</Text>
                <Text style={styles.subtitle}>You can say something about yourself or skip this step entirely if it doesn't feel right.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                I'm ready
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceIntroScreen;