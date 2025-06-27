import React, { useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import useUserStore from '../../../repositories/localStorage/useUserStore';

interface StepData {
    question: string,
    options: string[]
}

const stepsData: StepData[] = [
    {
        question: 'You find yourself in a busy square. Music drifts from somewhere nearby. What draws your attention?',
        options: [
            'People laughing near a café.',
            'A street musician playing nearby.',
            'People walking and talking around you.',
        ],
    },
    {
        question: 'Someone offers you company for your walk. Who feels like a good match today?',
        options: [
            'Someone who listens well.',
            'Someone who likes to share stories.',
            'Someone calm who moves at your pace.',
        ],
    },

];

import styles from '../../../styles';

const OnboardingInsightsScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const setUserInsight = useUserStore((state: any) => state.setUserInsight);

    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepAnswerIndex, setStepAnswerIndex] = useState<number | undefined>(undefined);

    const currentStep: StepData = stepsData[stepIndex];

    const handleOptionSelect = (optionIndex: number) => {
        if (stepAnswerIndex === optionIndex) {
            setStepAnswerIndex(undefined);
        }
        else {
            setStepAnswerIndex(optionIndex);
        }
    };

    const goToNextStep = () => {
        if (stepIndex < stepsData.length - 1) {
            setStepIndex(stepIndex + 1);
            setStepAnswerIndex(undefined);
        } else {
            navigation.replace('OnboardingNavigator', { screen: 'OnboardingSend' });
        }
    };

    const handleSkip = () => {
        goToNextStep();
    };

    const generateInsight = (stepData: StepData, answerIndex: number) => {
        return `${stepData.question} ${stepData.options[answerIndex]}`;
    };

    const handleNext = () => {
        if(stepAnswerIndex === undefined) {
            return;
        }

        setUserInsight(generateInsight(currentStep, stepAnswerIndex));
        goToNextStep();
    };

    return (
        <Layout style={styles.container}>
            <Text category="h3" style={styles.title}>Insights</Text>
            <Text category="s1" style={{ marginVertical: 20 }}>{currentStep.question}</Text>

            {currentStep.options.map((option, idx) => (
                <Button
                    key={idx}
                    style={{ marginVertical: 6 }}
                    onPress={() => handleOptionSelect(idx)}
                    appearance={stepAnswerIndex === idx ? 'filled' : 'outline'}
                >
                    {option}
                </Button>
            ))}

            <Button
                onPress={handleSkip}
                appearance='ghost'
                style={{ marginTop: 10 }}
            >
                Skip
            </Button>

            <Button
                onPress={handleNext}
                style={{ marginTop: 20 }}
            >
                {stepIndex === stepsData.length - 1 ? 'Done' : 'Next'}
            </Button>
        </Layout>
    );
}

export default OnboardingInsightsScreen;