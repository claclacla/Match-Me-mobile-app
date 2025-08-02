import React, { useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import { User } from '../../../repositories/globalEntities/User';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import { setUserGroupInsights } from '../../../repositories/api/setUserGroupInsights';
import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';

import AnimatedFeedback from './components/AnimatedFeedback';
import { colors } from '../../../styles';

import styles from '../../../styles';

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
        title: "The First Encounter",
        question: "You walk into a room where a small group is already gathered. They're chatting softly. No one notices you yet. What do you do?",
        options: [
            { text: "Hang back for a moment and observe.", trait: "observer" },
            { text: "Step in, smile, and say hello.", trait: "initiator" },
            { text: "Read the room and ease in naturally.", trait: "adaptive" }
        ]
    },
    {
        title: "Finding Comfort",
        question: "You take your place in the group. The conversation is open, low-pressure. You could speak or just listen. What helps you feel at ease?",
        options: [
            { text: "Knowing I can just be quiet and be myself.", trait: "non-performative" },
            { text: "Feeling someone gently includes me.", trait: "social-safety" },
            { text: "Sensing mutual curiosity and care.", trait: "mutual-attunement" }
        ]
    },
    {
        title: "A Deeper Turn",
        question: "Someone shares something vulnerable. The group gets quieter, more real. All eyes shift toward you. What do you bring in this moment?",
        options: [
            { text: "A calm presence. I listen with care.", trait: "attunement" },
            { text: "Something true from me. I like to meet openness with openness.", trait: "emotional-honesty" },
            { text: "A shift in energy. I lighten the mood when things get heavy.", trait: "lightness" }
        ]
    },
    {
        title: "When Something Feels Off",
        question: "Later, you notice a subtle shift. Maybe you feel a little outside the flow. Nothing major, but it changes your energy. What happens inside you?",
        options: [
            { text: "I become quiet and gently step back.", trait: "withdrawal" },
            { text: "I stay present and try to understand.", trait: "curiosity-under-pressure" },
            { text: "I keep a mental distance until it clears.", trait: "self-protection" }
        ]
    },
    {
        title: "At the End",
        question: "The group is wrapping up. Someone asks, 'What was this like for you?' What comes to mind?",
        options: [
            { text: "It felt meaningful. I felt seen.", trait: "connection-seeking" },
            { text: "It was energizing. I like creating with others.", trait: "collaborative-drive" },
            { text: "It was gentle. I liked just being together without pressure.", trait: "quiet-companionship" }
        ]
    }
];

const StepIndicator = ({ total, current }: { total: number, current: number }) => (
    <Layout style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 16,
        alignItems: 'center'
    }}>
        {Array.from({ length: total }).map((_, index) => (
            <Layout
                key={index}
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    marginHorizontal: 6,
                    backgroundColor: index === current ? colors.primary : colors.gray200,
                    borderWidth: index === current ? 0 : 1,
                    borderColor: colors.gray300,
                }}
            />
        ))}
    </Layout>
);

const OnboardingGroupBehaviorInsightsQuestionsScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);
    const setLocalStorageUserGroupInsights = useUserStore((state: any) => state.setUserGroupInsights);

    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepAnswersIndexes, setStepAnswersIndexes] = useState<StepAnswersIndexes>({});

    const [traitPoints, setTraitPoints] = useState<{ [trait: string]: number }>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isFeedbackAnimating, setIsFeedbackAnimating] = useState(false);
    const [isSettingUserGroupBehavior, setIsSettingUserGroupBehavior] = useState(false);

    const currentStep: StepData = stepsData[stepIndex];

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const generateInsights = (): string[] => {
        console.log("Generate insights...");
        const insights: string[] = Object.entries(stepAnswersIndexes).map(([questionIndex, answerIndex]) => {
            const stepData = stepsData[Number(questionIndex)];

            if (answerIndex === undefined) {
                return `${stepData.question} (skipped)`;
            }

            return `${stepData.question} ${stepData.options[answerIndex].text} ${stepData.options[answerIndex].trait}`;
        });

        console.log("insights: ", insights);
        return insights;
    };

    const goToNextStep = async () => {
        if (isFeedbackAnimating) {
            return;
        }

        if (stepIndex < stepsData.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            setIsSettingUserGroupBehavior(true);

            const userGroupInsights: string[] = generateInsights();

            setLocalStorageUserGroupInsights(userGroupInsights);
            await setUserGroupInsights({ key, userId: user.id, insights: userGroupInsights });

            navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsThankYou' });
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
                    justifyContent: 'flex-end',
                    height: 200,
                    paddingHorizontal: 24,
                    paddingBottom: 24,
                }}
            >
                <Text style={{ 
                    textAlign: 'center', 
                    marginBottom: 8,
                    fontSize: 14,
                    color: colors.gray600,
                    fontWeight: '500'
                }}>
                    Step {stepIndex + 1} of {stepsData.length}
                </Text>
                <StepIndicator total={stepsData.length} current={stepIndex} />
                <Text style={{ 
                    textAlign: 'center', 
                    marginTop: 16,
                    fontSize: 28,
                    fontWeight: '700',
                    color: colors.gray900,
                    letterSpacing: -0.5
                }}>
                    {currentStep.title}
                </Text>
            </Layout>
            
            <Layout style={{ height: 60, justifyContent: 'center' }}>
                {feedback && (
                    <AnimatedFeedback
                        message={feedback}
                        onAnimationEnd={() => {
                            setFeedback(null);
                            setIsFeedbackAnimating(false);
                        }}
                    />
                )}
            </Layout>
            
            <Layout style={{ flex: 1, paddingHorizontal: 24 }}>
                <Text style={{ 
                    marginVertical: 24,
                    fontSize: 18,
                    lineHeight: 26,
                    color: colors.gray700,
                    fontWeight: '500',
                    textAlign: 'center'
                }}>
                    {currentStep.question}
                </Text>

                {currentStep.options.map((option: StepOptionData, answerIndex: number) => (
                    <Button
                        key={answerIndex}
                        style={{
                            marginVertical: 8,
                            borderRadius: 12,
                            height: 'auto',
                            minHeight: 60,
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                        }}
                        onPress={() => handleOptionSelect(answerIndex)}
                        appearance={stepAnswersIndexes[stepIndex] === answerIndex ? 'filled' : 'outline'}
                        disabled={isFeedbackAnimating || isSettingUserGroupBehavior}
                    >
                        {option.text}
                    </Button>
                ))}

                <Button
                    onPress={handleSkip}
                    style={{
                        marginTop: 32,
                        marginBottom: 20,
                    }}
                    disabled={isFeedbackAnimating || isSettingUserGroupBehavior}
                    appearance="ghost"
                >
                    Skip
                </Button>
            </Layout>
        </Layout>
    );
}

export default OnboardingGroupBehaviorInsightsQuestionsScreen;