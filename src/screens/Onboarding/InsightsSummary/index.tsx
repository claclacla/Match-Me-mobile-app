import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const personalitySummaries = [
    {
        id: 'the_connector',
        name: 'The Connector',
        traits: ['sociability', 'collaboration', 'community'],
        summary: "You thrive on connection and shared experiences. Whether it's a plaza full of people or a cozy group chat, you're at home when others are near.",
    },
    {
        id: 'the_wanderer',
        name: 'The Wanderer',
        traits: ['curiosity', 'openness', 'exploration'],
        summary: "You’re driven by curiosity. You follow the music, ask questions, and love discovering what others might overlook.",
    },
    {
        id: 'the_anchor',
        name: 'The Anchor',
        traits: ['stability', 'self-awareness', 'caution'],
        summary: "You move at your own rhythm. Calm, grounded, and intentional, you create space for clarity and comfort.",
    },
    {
        id: 'the_maker',
        name: 'The Maker',
        traits: ['creativity', 'depth', 'authenticity'],
        summary: "You're someone who expresses themselves in thoughtful, original ways. Whether sketching an idea or sharing a quote, your perspective leaves a mark.",
    },
];

function getBestMatchSummary(traitPoints: { [trait: string]: number }) {
    const topTraits = Object.entries(traitPoints)
        .sort(([, a], [, b]) => b - a)
        .map(([trait]) => trait);

    let bestMatch = null;
    let highestScore = 0;

    for (const summary of personalitySummaries) {
        const matchCount = summary.traits.filter(trait => topTraits.includes(trait)).length;
        if (matchCount > highestScore) {
            bestMatch = summary;
            highestScore = matchCount;
        }
    }

    return bestMatch;
}


export interface OnboardingInsightsSummaryParams {
    traitPoints: { [trait: string]: number };
}

const OnboardingInsightsSummaryScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const route = useRoute();
    const { traitPoints } = route.params as OnboardingInsightsSummaryParams;

    const match = getBestMatchSummary(traitPoints);

    const handleContinue = () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingSend' });
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={[styles.title, { textAlign: 'center', marginBottom: 24 }]}>
                Your Character Summary
            </Text>

            <Text category="h5" style={{ textAlign: 'center', marginTop: 30, marginBottom: 16 }}>
                You are… {match?.name}
            </Text>
            <Text category="s1" style={{ textAlign: 'center', paddingHorizontal: 24 }}>
                {match?.summary}
            </Text>

            <Button style={{ marginTop: 30 }} onPress={handleContinue}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingInsightsSummaryScreen;