import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../../styles';

const OnboardingGroupBehaviorInsightsCoverScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleContinue = () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsIntro' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Now, let’s imagine a moment together</Text>

            <Text style={styles.subtitle}>We’d like to get a feel for how you move in a group.</Text>
            <Text style={styles.subtitle}>Not through questions, but through a small story.</Text>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupBehaviorInsightsCoverScreen;
