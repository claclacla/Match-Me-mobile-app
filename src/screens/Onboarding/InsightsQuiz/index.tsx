import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

// Assets
const logoImage = require('../../../../assets/images/logo.png');
const backArrowImage = require('../../../../assets/images/back-arrow.png');

const { width: screenWidth } = Dimensions.get('window');

const InsightsQuizScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

    const slides = [
        {
            title: "Help us get to know you.",
            emoji: "🧭",
            content: (
                <View style={styles.slideContent}>
                    <Text style={styles.introText}>
                        Before you start, answer 5 quick questions about how you move in a group.{'\n\n'}There are no right answers, just signals that help us shape the app around your needs.
                    </Text>
                </View>
            ),
            isIntro: true
        },
        {
            title: "The First Encounter",
            subtitle: "You walk into a room. A small group is already chatting, soft and warm. No one has noticed you—yet. What do you do?",
            question: "Please choose one option.",
            options: [
                "Hang back for a moment and observe.",
                "Step in, smile, and say hello.",
                "Read the vibe and ease in naturally."
            ],
            stepText: "Step 1 of 5"
        },
        {
            title: "Finding comfort",
            subtitle: "You settle into the group. The vibe is open and low-pressure. You could speak—or just listen. What helps you feel at ease?",
            question: "Please choose one option.",
            options: [
                "Knowing I can be quiet and still be myself.",
                "Feeling someone gently includes me.",
                "Sensing mutual curiosity and care."
            ],
            stepText: "Step 2 of 5"
        },
        {
            title: "A Deeper Turn",
            subtitle: "Someone shares something vulnerable. The room softens, feels more real. Eyes turn to you. What do you bring in this moment?",
            question: "Please choose one option.",
            options: [
                "A calm presence — I listen with care.",
                "I meet openness with openness.",
                "I lighten the mood when it's heavy."
            ],
            stepText: "Step 3 of 5"
        },
        {
            title: "Something feels off",
            subtitle: "Later, you sense a subtle shift. You feel slightly outside the flow—nothing major, but your energy changes. What happens inside you?",
            question: "Please choose one option.",
            options: [
                "I go quiet and gently step back.",
                "I stay present and try to understand.",
                "I keep some distance until it passes."
            ],
            stepText: "Step 4 of 5"
        },
        {
            title: "At the end",
            subtitle: "The group is wrapping up. Someone asks, \"What was this like for you?\" What comes to mind?",
            question: "Please choose one option.",
            options: [
                "It felt meaningful. I felt seen.",
                "Energizing. I enjoy creating with others.",
                "I liked being together without pressure."
            ],
            stepText: "Step 5 of 5"
        },
        {
            title: "There are a lot of friends nearby.",
            content: (
                <View style={styles.slideContent}>
                    <Text style={styles.outroText}>
                        You've sketched a shape others can approach. You're not alone in what you shared.{'\n\n'}We believe beautiful thinks happen when people feel safe and seen.{'\n\n'}We're excited to see the connections you'll create. Welcome aboard!
                    </Text>
                </View>
            ),
            isOutro: true
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // Quiz completed - navigate back or to next step
            navigation.goBack();
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        } else {
            navigation.goBack();
        }
    };

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentSlide]: optionIndex
        });
    };

    const currentSlideData = slides[currentSlide];
    const isLastSlide = currentSlide === slides.length - 1;
    const hasAnswer = selectedAnswers[currentSlide] !== undefined;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FAF5F1" barStyle="dark-content" />
            
            {/* Logo Header */}
            <View style={styles.logoHeader}>
                <View style={styles.logoIcon}>
                    <Image
                        source={logoImage}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.logoText}>BREAKICE</Text>
            </View>

            {/* Back Button */}
            {!currentSlideData.isIntro && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Image source={backArrowImage} style={styles.backIcon} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            )}

            {/* Step Indicator */}
            {!currentSlideData.isIntro && !currentSlideData.isOutro && (
                <Text style={styles.stepText}>{currentSlideData.stepText}</Text>
            )}

            {/* Main Content */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {currentSlideData.emoji && (
                    <Text style={styles.emoji}>{currentSlideData.emoji}</Text>
                )}
                <Text style={styles.title}>{currentSlideData.title}</Text>
                {currentSlideData.subtitle && (
                    <Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
                )}
                
                {currentSlideData.content}
                
                {/* Quiz Options */}
                {currentSlideData.options && (
                    <View style={styles.optionsContainer}>
                        {currentSlideData.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    selectedAnswers[currentSlide] === index && styles.optionButtonSelected
                                ]}
                                onPress={() => handleOptionSelect(index)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedAnswers[currentSlide] === index && styles.optionTextSelected
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.questionText}>{currentSlideData.question}</Text>
                    </View>
                )}

                {/* Progress Bar */}
                {!currentSlideData.isIntro && !currentSlideData.isOutro && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${((currentSlide - 1) / 4) * 100}%` }]} />
                        </View>
                    </View>
                )}

                {/* Bottom Button - Inside ScrollView for intro slide */}
                {currentSlideData.isIntro && (
                    <View style={styles.introButtonContainer}>
                        <TouchableOpacity style={styles.startButton} onPress={handleNext}>
                            <Text style={styles.startButtonText}>Start the story</Text>
                        </TouchableOpacity>
                        <Text style={styles.introSubtext}>Takes ~2 minutes • 5 choices</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Button - Outside ScrollView for other slides */}
            {!currentSlideData.isIntro && (
                <View style={styles.bottomButtons}>
                    {currentSlideData.isOutro ? (
                        <TouchableOpacity style={styles.joinButton} onPress={handleNext}>
                            <Text style={styles.joinButtonText}>Join group now</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={[styles.continueButton, !hasAnswer && styles.continueButtonDisabled]} 
                            onPress={handleNext}
                            disabled={!hasAnswer}
                        >
                            <Text style={[styles.continueButtonText, !hasAnswer && styles.continueButtonTextDisabled]}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Privacy Text - At the very bottom for intro slide */}
            {currentSlideData.isIntro && (
                <View style={styles.privacyContainer}>
                    <Text style={styles.privacyText}>Private. Edit anytime.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF5F1',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 41,
        marginBottom: 0,
        paddingRight: 16,
    },
    logoIcon: {
        width: 72,
        height: 72,
        marginRight: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    logoText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 26,
        fontWeight: '700',
        color: '#E23D3D',
        letterSpacing: 4.83,
    },
    backButton: {
        position: 'absolute',
        top: 71,
        left: 17,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
        transform: [{ rotate: '90deg' }],
    },
    backButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
    },
    stepText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 2,
        marginTop: 20,
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        flexGrow: 1,
    },
    emoji: {
        fontSize: 64,
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
        width: 273,
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
        width: 300,
    },
    slideContent: {
        width: '100%',
        alignItems: 'center',
    },
    introText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        width: 300,
    },
    privacyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        textAlign: 'center',
    },
    outroText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 24,
        width: 300,
    },
    optionsContainer: {
        width: '100%',
        maxWidth: 329,
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    optionButtonSelected: {
        backgroundColor: '#E23D3D',
        borderColor: '#E23D3D',
    },
    optionText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
    },
    optionTextSelected: {
        color: '#FFFFFF',
    },
    questionText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    progressBar: {
        width: 244,
        height: 16,
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E23D3D',
        borderRadius: 8,
    },
    introButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    introSubtext: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 2,
        marginTop: 20,
    },
    privacyContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    privacyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 2,
    },
    bottomButtons: {
        paddingHorizontal: 32,
        paddingBottom: 35,
        paddingTop: 0,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        width: 262,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    joinButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        width: 262,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#E23D3D',
        borderRadius: 8,
        height: 45,
        width: 262,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    continueButtonTextDisabled: {
        color: '#999999',
    },
});

export default InsightsQuizScreen;
