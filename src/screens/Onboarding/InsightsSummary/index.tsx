import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const personalitySummaries = [
  {
    id: 'the_syncer',
    name: 'The Syncer',
    traits: ['coordination', 'structure', 'inclusion'],
    summary: "You bring clarity to group chaos. Whether it’s syncing people up or organizing ideas, you make collaboration smoother. You’re often the reason things feel aligned.",
  },
  {
    id: 'the_tuner',
    name: 'The Tuner',
    traits: ['emotional-intelligence', 'allyship', 'emotional-leadership'],
    summary: "You’re deeply attuned to group dynamics. You sense what others need — even if unspoken — and act to restore balance or bring warmth where it’s needed most.",
  },
  {
    id: 'the_wave',
    name: 'The Wave',
    traits: ['flexibility', 'flow', 'open-ended'],
    summary: "You move with the moment. Light on your feet, open to change, and okay with ambiguity — you go where the energy goes, trusting that things will unfold naturally.",
  },
  {
    id: 'the_edgewalker',
    name: 'The Edgewalker',
    traits: ['independent-thinking', 'self-containment', 'reflection'],
    summary: "You value your perspective, even when it diverges. Quiet, perceptive, and selective in your engagement — you bring insight without needing to take center stage.",
  },
  {
    id: 'the_igniter',
    name: 'The Igniter',
    traits: ['conviction', 'problem-solving', 'assertiveness'],
    summary: "You step in and spark movement. When a group stalls, you energize it. You’re not afraid to take sides, name tension, or act when something needs to shift.",
  },
  {
    id: 'the_bridgebuilder',
    name: 'The Bridgebuilder',
    traits: ['mediator', 'pragmatism', 'appreciation'],
    summary: "You help groups find middle ground. Listening before acting, you balance differing voices and help people feel acknowledged, even when they disagree.",
  },
  {
    id: 'the_mirror',
    name: 'The Mirror',
    traits: ['realism', 'respect', 'strategic-patience'],
    summary: "You reflect what others miss. You accept group imperfections without judgment and let dynamics reveal themselves. Your strength is in seeing things clearly.",
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