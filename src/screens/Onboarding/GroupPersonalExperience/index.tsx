import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../../styles';

const OnboardingGroupPersonalExperienceScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    //const handleContinue = () => {
    //    navigation.replace('OnboardingNavigator', { screen: 'OnboardingSend' });
    //};

    return (
        <Layout style={[styles.container, { justifyContent: 'center', padding: 24 }]}>
            <Text category="h3" style={[styles.title, { textAlign: 'center', marginBottom: 16 }]}>
                Your personal experience
            </Text>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceScreen;
