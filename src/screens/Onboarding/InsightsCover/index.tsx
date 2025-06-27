import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../../styles';

const InsightsCoverScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const handleStart = () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingInsights' });
    };

    return (
        <Layout style={[styles.container, { justifyContent: 'center', padding: 24 }]}>
            <Text category="h3" style={[styles.title, { textAlign: 'center', marginBottom: 16 }]}>
                Discover Your Insights
            </Text>

            <Text appearance="hint" category="s1" style={{ textAlign: 'center', marginBottom: 32, paddingHorizontal: 10 }}>
                Ready to start your adventure? Answer a few story-based questions to uncover your unique traits and preferences as a newcomer.
            </Text>

            <Button style={styles.button} onPress={handleStart}>
                Start
            </Button>
        </Layout>
    );
};

export default InsightsCoverScreen;
