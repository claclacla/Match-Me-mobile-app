import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../../styles';

const OnboardingGroupBehaviorInsightsIntroScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsQuestions' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>A Group of Strangers</Text>

            <Text style={styles.subtitle}>Imagine you're joining a small group for the first time. Just 3 or 4 people. It’s calm, informal, open.</Text>
            <Text style={styles.subtitle}>You don’t need to perform, just be yourself. Let’s walk through a few moments together.</Text>
            <Text style={styles.subtitle}>There are no wrong answers, only traces that help others feel you.</Text>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupBehaviorInsightsIntroScreen;
