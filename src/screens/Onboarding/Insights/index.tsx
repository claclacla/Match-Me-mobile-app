import React, { useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import useUserStore from '../../../repositories/localStorage/useUserStore';

import AnimatedFeedback from './components/AnimatedFeedback';

interface StepOptionData {
    text: string,
    trait: string
}

interface StepData {
    title: string,
    question: string,
    options: StepOptionData[]
}

interface StepAnswersIndexes {
    [questionIndex: number]: number | undefined
}

const stepsData = [
    {
        title: "The Arrival",
        question: "You step off the train with a bag, a phone at 20%, and no real plan. The station is buzzing. A map shows three directions to explore. What do you follow?",
        options: [
            { text: "The sound of street music.", trait: "curiosity" },
            { text: "A crowd heading to a nearby plaza.", trait: "sociability" },
            { text: "A quiet alley lined with cafés.", trait: "introspection" }
        ]
    },
    {
        title: "The First Choice",
        question: "You stop by a small cultural centre offering events. A volunteer invites you to join one. It’s last-minute, no details given. How do you respond?",
        options: [
            { text: "Say yes, what’s the worst that can happen?", trait: "openness" },
            { text: "Ask for a bit more information first.", trait: "caution" },
            { text: "Politely decline and keep walking.", trait: "independence" }
        ]
    },
    {
        title: "The Stranger on the Tram",
        question: "You sit on a tram. Someone your age starts chatting. They ask what brought you here. What do you share?",
        options: [
            { text: "A short, honest story about your goals.", trait: "authenticity" },
            { text: "Something light and easy, to stay friendly.", trait: "adaptability" },
            { text: "You smile, but keep it vague.", trait: "reserve" }
        ]
    },
    {
        title: "The Invitation",
        question: "They mention a small get-together tonight with people from different backgrounds. No pressure. What do you do?",
        options: [
            { text: "Go — it could be a chance to connect.", trait: "sociability" },
            { text: "Say maybe, and decide later.", trait: "flexibility" },
            { text: "Thank them, but you're not in the mood today.", trait: "self-awareness" }
        ]
    },
    {
        title: "The Moment",
        question: "At a park, a street performer invites passersby to join a small improv game. People are laughing. Eyes turn to you. What do you do?",
        options: [
            { text: "Step in — you like these moments.", trait: "boldness" },
            { text: "Cheer along, maybe record a clip.", trait: "supportiveness" },
            { text: "Watch from a distance, it’s not your thing.", trait: "introspection" }
        ]
    },
    {
        title: "The Shared Space",
        question: "You visit a co-living space. You're asked to describe your ideal common room. What matters most to you?",
        options: [
            { text: "A space where people talk and share ideas.", trait: "collaboration" },
            { text: "A cozy corner to quietly recharge.", trait: "self-care" },
            { text: "A flexible space — sometimes chatty, sometimes calm.", trait: "adaptability" }
        ]
    },
    {
        title: "The Memory Wall",
        question: "There’s a wall where new arrivals pin a photo or write something meaningful. What would you add?",
        options: [
            { text: "A moment that shaped your life.", trait: "depth" },
            { text: "A quote or phrase that helps you.", trait: "reflection" },
            { text: "A sketch or image that captures how you feel now.", trait: "creativity" }
        ]
    },
    {
        title: "The Skill Swap",
        question: "A local community board offers workshops: language, design, storytelling, coding... Which do you offer?",
        options: [
            { text: "Something you’re good at and love sharing.", trait: "generosity" },
            { text: "Something practical you know.", trait: "utility" },
            { text: "You’d rather join than teach right now.", trait: "humility" }
        ]
    },
    {
        title: "The Honest Talk",
        question: "Over coffee, someone asks what you’re really looking for in this city. You say…",
        options: [
            { text: "People you can trust and grow with.", trait: "connection" },
            { text: "A sense of belonging and shared culture.", trait: "community" },
            { text: "A mix — space to be yourself, but stay open.", trait: "balance" }
        ]
    },
    {
        title: "The Day’s End",
        question: "Before sleeping, you mark the places you visited today. The city feels a bit more yours. What do you think about the day?",
        options: [
            { text: "I’m excited for what’s next.", trait: "optimism" },
            { text: "I feel grounded — slowly finding my rhythm.", trait: "stability" },
            { text: "I’m still unsure, but I want to keep exploring.", trait: "openness" }
        ]
    }
];


import styles from '../../../styles';

const StepIndicator = ({ total, current }: { total: number, current: number }) => (
    <Layout style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        {Array.from({ length: total }).map((_, index) => (
            <Layout
                key={index}
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor: index === current ? '#3366FF' : '#E4E9F2',
                }}
            />
        ))}
    </Layout>
);

const OnboardingInsightsScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const user = useUserStore((state: any) => state.user);
    const setUserInsights = useUserStore((state: any) => state.setUserInsights);

    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepAnswersIndexes, setStepAnswersIndexes] = useState<StepAnswersIndexes>({});

    const [traitPoints, setTraitPoints] = useState<{ [trait: string]: number }>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isFeedbackAnimating, setIsFeedbackAnimating] = useState(false);

    const currentStep: StepData = stepsData[stepIndex];

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleOptionSelect = (optionIndex: number) => {
        if (isFeedbackAnimating) {
            return;
        }

        const selected = stepsData[stepIndex].options[optionIndex];

        setStepAnswersIndexes(prev => ({ ...prev, [stepIndex]: optionIndex }));

        if (selected.trait) {
            setTraitPoints(prev => ({
                ...prev,
                [selected.trait]: (prev[selected.trait] || 0) + 1
            }));

            setIsFeedbackAnimating(true); // animation begins
            setFeedback(`+1 ${capitalize(selected.trait)}`);
        }
    };

    const generateInsight = (): string[] => {
        console.log("Generate insights...");
        const insights: string[] = Object.entries(stepAnswersIndexes).map(([questionIndex, answerIndex]) => {
            const stepData = stepsData[Number(questionIndex)];

            if (answerIndex === undefined) {
                return `${stepData.question} (skipped)`;
            }

            const optionText = stepData.options[answerIndex];
            console.log(`${stepData.question} ${optionText}`);
            return `${stepData.question} ${optionText}`;
        });

        console.log("insights: ", insights);
        return insights;
    };

    const goToNextStep = () => {
        console.log(user);

        if (stepIndex < stepsData.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            setUserInsights(generateInsight());
            navigation.replace('OnboardingNavigator', { screen: 'OnboardingInsightsSummary', params: { traitPoints } });
        }
    };

    const handleSkip = () => {
        if (isFeedbackAnimating) {
            return;
        }

        setStepAnswersIndexes(prev => ({ ...prev, [stepIndex]: undefined }));
        goToNextStep();
    };

    const handleNext = () => {
        if (isFeedbackAnimating) {
            return;
        }

        if (stepAnswersIndexes[stepIndex] === undefined) {
            return;
        }

        goToNextStep();
    };

    return (
        <Layout style={styles.container}>
            <Layout
                style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end', // aligns title to bottom within 200 height
                    height: 200,
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                }}
            >
                <Text appearance="hint" style={{ textAlign: 'center', marginBottom: 5 }}>
                    Step {stepIndex + 1} of {stepsData.length}
                </Text>
                <StepIndicator total={stepsData.length} current={stepIndex} />
                <Text category="h3" style={{ textAlign: 'center', marginTop: 16 }}>
                    {currentStep.title}
                </Text>
            </Layout>
            <Layout style={{ height: 50 }}>
                {feedback && (
                    <AnimatedFeedback
                        message={feedback}
                        onAnimationEnd={() => {
                            setFeedback(null);
                            setIsFeedbackAnimating(false); // allow interaction again
                        }}
                    />
                )}
            </Layout>
            <Layout style={{ flex: 1 }}>
                <Text category="s1" style={{ marginVertical: 20 }}>{currentStep.question}</Text>

                {currentStep.options.map((option: StepOptionData, answerIndex: number) => (
                    <Button
                        key={answerIndex}
                        style={{ marginVertical: 6 }}
                        onPress={() => handleOptionSelect(answerIndex)}
                        appearance={stepAnswersIndexes[stepIndex] === answerIndex ? 'filled' : 'outline'}
                        disabled={isFeedbackAnimating} 
                    >
                        {option.text}
                    </Button>
                ))}

                <Button
                    onPress={handleSkip}
                    appearance='ghost'
                    style={{ marginTop: 10 }}
                    disabled={isFeedbackAnimating} 
                >
                    Skip
                </Button>

                <Button
                    onPress={handleNext}
                    style={{ marginTop: 20 }}
                    disabled={isFeedbackAnimating} 
                >
                    {stepIndex === stepsData.length - 1 ? 'Done' : 'Next'}
                </Button>
            </Layout>
        </Layout>
    );
}

export default OnboardingInsightsScreen;