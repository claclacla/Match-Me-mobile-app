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
        title: "The Mission Brief",
        question: "You’ve just joined a 4-person team for a local quest. You barely know them. The leader asks everyone to share how they like to contribute. What do you say?",
        options: [
            { text: "I’m a planner — I help organize the chaos.", trait: "structure" },
            { text: "I’m the glue — I keep the group vibe alive.", trait: "emotional-intelligence" },
            { text: "I adapt — tell me what’s needed, I’ll jump in.", trait: "flexibility" }
        ]
    },
    {
        title: "The Unexpected Delay",
        question: "Halfway to your destination, the group faces a delay. Tension rises. What’s your move?",
        options: [
            { text: "Crack a joke or lighten the mood.", trait: "humor" },
            { text: "Start a practical discussion on plan B.", trait: "problem-solving" },
            { text: "Let others talk while you reflect quietly.", trait: "calm-presence" }
        ]
    },
    {
        title: "The Loud Voice",
        question: "One member dominates the group talk, cutting others off. What do you do?",
        options: [
            { text: "Step in kindly to balance the space.", trait: "assertiveness" },
            { text: "Support quieter members by amplifying them.", trait: "allyship" },
            { text: "Stay out — it’s not your fight.", trait: "detachment" }
        ]
    },
    {
        title: "The Late Arrival",
        question: "You arrive late to the group meetup. They’ve started without you. What do you feel?",
        options: [
            { text: "Slightly off, but I’ll catch up fast.", trait: "resilience" },
            { text: "Embarrassed — I try to quietly blend in.", trait: "sensitivity" },
            { text: "Unbothered — I’ll jump in when I’m ready.", trait: "self-assurance" }
        ]
    },
    {
        title: "The Group Decision",
        question: "Your group must choose between two activities. Opinions are split. What’s your role?",
        options: [
            { text: "I listen, then suggest a compromise.", trait: "mediator" },
            { text: "I take a side and explain why.", trait: "conviction" },
            { text: "I stay neutral and observe.", trait: "observer" }
        ]
    },
    {
        title: "The Silent Member",
        question: "One person hasn’t spoken much. You’re in a circle about to share ideas. What do you do?",
        options: [
            { text: "Invite them in with an open question.", trait: "inclusion" },
            { text: "Keep it flowing — maybe they’ll chime in later.", trait: "flow" },
            { text: "Let them be — silence can be powerful too.", trait: "respect" }
        ]
    },
    {
        title: "The Group Challenge",
        question: "The group must solve a timed puzzle. Everyone’s thinking differently. What’s your instinct?",
        options: [
            { text: "Suggest we pause and sync up.", trait: "coordination" },
            { text: "Focus on your own angle and share later.", trait: "independent-thinking" },
            { text: "Back someone’s idea and help them push it through.", trait: "support" }
        ]
    },
    {
        title: "The End of the Day",
        question: "After a long shared day, someone asks: 'How did you feel about our group?' You say…",
        options: [
            { text: "I liked how we all brought something unique.", trait: "appreciation" },
            { text: "It was fine — we worked, not sure we clicked.", trait: "realism" },
            { text: "Hard to say — I’m still figuring it out.", trait: "reflection" }
        ]
    },
    {
        title: "The Small Conflict",
        question: "Two members quietly disagree. No one’s addressing it. What’s your reaction?",
        options: [
            { text: "Name it gently and check in with both.", trait: "emotional-leadership" },
            { text: "Keep things moving — it’ll sort itself.", trait: "pragmatism" },
            { text: "Watch how it plays out — dynamics reveal truth.", trait: "strategic-patience" }
        ]
    },
    {
        title: "The Goodbye",
        question: "It’s time to part ways. Someone suggests staying in touch. What do you feel?",
        options: [
            { text: "Absolutely — I value these bonds.", trait: "relational" },
            { text: "Maybe — depends on how things evolve.", trait: "open-ended" },
            { text: "Not really — I prefer to move on.", trait: "self-containment" }
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

const OnboardingGroupBehaviorInsightsScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const user = useUserStore((state: any) => state.user);
    const setUserGroupInsights = useUserStore((state: any) => state.setUserGroupInsights);

    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepAnswersIndexes, setStepAnswersIndexes] = useState<StepAnswersIndexes>({});

    const [traitPoints, setTraitPoints] = useState<{ [trait: string]: number }>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isFeedbackAnimating, setIsFeedbackAnimating] = useState(false);

    const currentStep: StepData = stepsData[stepIndex];

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);


    const generateInsights = (): string[] => {
        console.log("Generate insights...");
        const insights: string[] = Object.entries(stepAnswersIndexes).map(([questionIndex, answerIndex]) => {
            const stepData = stepsData[Number(questionIndex)];

            if (answerIndex === undefined) {
                return `${stepData.question} (skipped)`;
            }

            return `${stepData.question} ${stepData.options[answerIndex].text} I prefer ${stepData.options[answerIndex].trait}`;
        });

        console.log("insights: ", insights);
        return insights;
    };

    const goToNextStep = () => {
        console.log(user);

        if (stepIndex < stepsData.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            setUserGroupInsights(generateInsights());
            navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsSummary', params: { traitPoints } });
        }
    };

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

        goToNextStep();
    };

    const handleSkip = () => {
        if (isFeedbackAnimating) {
            return;
        }

        setStepAnswersIndexes(prev => ({ ...prev, [stepIndex]: undefined }));
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
            </Layout>
        </Layout>
    );
}

export default OnboardingGroupBehaviorInsightsScreen;