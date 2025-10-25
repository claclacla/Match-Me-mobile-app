import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

// Assets
const logoImage = require('../../../../assets/images/logo.png');
const backArrowImage = require('../../../../assets/images/back-arrow.png');

const { width: screenWidth } = Dimensions.get('window');

const HowItWorksScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "You won't walk in alone anymore",
            stepText: "Step 1 of 3",
            content: (
                <View style={styles.slideContent}>
                    <View style={styles.tagsContainer}>
                        <View style={[styles.tag, styles.tag1, styles.tagPosition1]}>
                            <Text style={styles.tagText}>Small groups</Text>
                        </View>
                        <View style={[styles.tag, styles.tag2, styles.tagPosition2]}>
                            <Text style={styles.tagText}>Real activities</Text>
                        </View>
                        <View style={[styles.tag, styles.tag3, styles.tagPosition3]}>
                            <Text style={styles.tagText}>No endless chat</Text>
                        </View>
                        <View style={[styles.tag, styles.tag4, styles.tagPosition4]}>
                            <Text style={styles.tagText}>Curated matches</Text>
                        </View>
                        <View style={[styles.tag, styles.tag5, styles.tagPosition5]}>
                            <Text style={styles.tagText}>Meet weekly</Text>
                        </View>
                        <View style={[styles.tag, styles.tag6, styles.tagPosition6]}>
                            <Text style={styles.tagText}>AI coach</Text>
                        </View>
                        <View style={[styles.tag, styles.tag7, styles.tagPosition7]}>
                            <Text style={styles.tagText}>3 - 4 people</Text>
                        </View>
                    </View>
                </View>
            )
        },
        {
            title: "Your first week on Breakice",
            stepText: "Step 2 of 3",
            content: (
                <View style={styles.slideContent}>
                    <View style={styles.stepsList}>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>1.</Text>
                            <Text style={styles.stepTextContent}>
                                <Text style={styles.stepBold}>Tell us your vibe:</Text>
                                {'\n'}2-minute quiz.
                            </Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>2.</Text>
                            <Text style={styles.stepTextContent}>
                                <Text style={styles.stepBold}>We form your group:</Text>
                                {'\n'}nearby people, similar pace.
                            </Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>3.</Text>
                            <Text style={styles.stepTextContent}>
                                <Text style={styles.stepBold}>Join the group chat:</Text>
                                {'\n'}propose an activity.
                            </Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>4.</Text>
                            <Text style={styles.stepTextContent}>
                                <Text style={styles.stepBold}>Meet, then repeat:</Text>
                                {'\n'}weekly is best.
                            </Text>
                        </View>
                    </View>
                </View>
            )
        },
        {
            title: "Your answers are private",
            stepText: "Step 3 of 3",
            content: (
                <View style={styles.slideContent}>
                    <View style={styles.benefitsContainer}>
                        <View style={styles.benefitCard}>
                            <Text style={styles.benefitTitle}>Better fit</Text>
                            <Text style={styles.benefitDescription}>
                                Our algorithm matches you with people who share your interests and values.
                            </Text>
                        </View>
                        <View style={styles.benefitCard}>
                            <Text style={styles.benefitTitle}>Smoother logistics</Text>
                            <Text style={styles.benefitDescription}>
                                We handle the planning so you can focus on connecting with your group.
                            </Text>
                        </View>
                        <View style={styles.benefitCard}>
                            <Text style={styles.benefitTitle}>Safety & respect</Text>
                            <Text style={styles.benefitDescription}>
                                All members are verified and committed to creating a safe, respectful environment.
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.privacyText}>Your answers are private.</Text>
                </View>
            )
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigation.goBack();
        }
    };

    const handleStartQuiz = () => {
        // TODO: Navigate to quiz when implemented
        console.log('Start quiz pressed');
        navigation.goBack();
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        } else {
            navigation.goBack();
        }
    };

    const currentSlideData = slides[currentSlide];

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
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Image source={backArrowImage} style={styles.backIcon} />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Step Indicator */}
            <Text style={styles.stepText}>{currentSlideData.stepText}</Text>

            {/* Main Content */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{currentSlideData.title}</Text>
                {currentSlideData.content}
            </ScrollView>

            {/* Bottom Buttons - Outside ScrollView for all slides */}
            <View style={styles.bottomButtonsInline}>
                {currentSlide < slides.length - 1 ? (
                    <>
                        <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.startQuizButton, styles.buttonSpacing]} onPress={handleStartQuiz}>
                            <Text style={styles.startQuizButtonText}>Start the quiz →</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.startQuizButton} onPress={handleStartQuiz}>
                        <Text style={styles.startQuizButtonText}>Start the quiz →</Text>
                    </TouchableOpacity>
                )}
            </View>
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
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 24,
        width: 273,
    },
    slideContent: {
        width: '100%',
        alignItems: 'center',
    },
    tagsContainer: {
        position: 'relative',
        width: 300,
        height: 600,
        alignSelf: 'center',
    },
    tag: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tag1: { 
        backgroundColor: '#FDE8E8', // Pink
        transform: [{ rotate: '-8deg' }] 
    },
    tag2: { 
        backgroundColor: '#FFC10A', // Yellow
        transform: [{ rotate: '2deg' }] 
    },
    tag3: { 
        backgroundColor: '#83B8D7', // Blue
        transform: [{ rotate: '-5deg' }] 
    },
    tag4: { 
        backgroundColor: '#FDE8E8', // Pink
        transform: [{ rotate: '5deg' }] 
    },
    tag5: { 
        backgroundColor: '#83B8D7', // Blue
        transform: [{ rotate: '-3deg' }] 
    },
    tag6: { 
        backgroundColor: '#FFC10A', // Yellow
        transform: [{ rotate: '6deg' }] 
    },
    tag7: { 
        backgroundColor: '#FDE8E8', // Pink
        transform: [{ rotate: '-8deg' }] 
    },
    tagPosition1: {
        position: 'absolute',
        top: 0,
        left: 20,
    },
    tagPosition2: {
        position: 'absolute',
        top: 35,
        right: 20,
    },
    tagPosition3: {
        position: 'absolute',
        top: 95,
        left: 10,
    },
    tagPosition4: {
        position: 'absolute',
        top: 135,
        right: 10,
    },
    tagPosition5: {
        position: 'absolute',
        top: 195,
        left: 15,
    },
    tagPosition6: {
        position: 'absolute',
        top: 235,
        right: 15,
    },
    tagPosition7: {
        position: 'absolute',
        top: 275,
        left: 30,
    },
    tagText: {
        fontFamily: 'Arial Rounded MT Bold',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
    },
    description: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 24,
        width: 278,
    },
    stepsList: {
        width: 278,
        alignItems: 'center',
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    stepNumber: {
        fontFamily: 'Rubik-Regular',
        fontSize: 17,
        fontWeight: '400',
        color: '#000000',
        marginRight: 8,
        lineHeight: 25,
    },
    stepTextContent: {
        fontFamily: 'Rubik-Regular',
        fontSize: 17,
        fontWeight: '400',
        color: '#000000',
        lineHeight: 25,
        flex: 1,
    },
    stepBold: {
        fontFamily: 'Rubik-Bold',
        fontWeight: '700',
    },
    benefitsContainer: {
        width: '100%',
        maxWidth: 300,
    },
    benefitCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    benefitTitle: {
        fontFamily: 'Rubik-SemiBold',
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 8,
    },
    benefitDescription: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 20,
    },
    privacyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginTop: 20,
    },
    bottomButtons: {
        paddingHorizontal: 32,
        paddingBottom: 40,
        paddingTop: 0,
        alignItems: 'center',
    },
    bottomButtonsInline: {
        paddingHorizontal: 32,
        paddingTop: 15,
        paddingBottom: 30,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonSpacing: {
        marginTop: 20,
    },
    continueButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        height: 44,
        width: 262,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#191919',
        textAlign: 'center',
    },
    startQuizButton: {
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
    startQuizButtonText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default HowItWorksScreen;
