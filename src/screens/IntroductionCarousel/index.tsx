import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Dimensions, 
    TouchableOpacity, 
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ApplicationNavigationProp } from '../../stackNavigationProps/ApplicationNavigationProp';

const { width, height } = Dimensions.get('window');

// Logo image from assets (same as signin/signup screens)
const logoImage = require('../../../assets/images/logo.png');

interface SlideData {
    id: number;
    title: string;
    subtitle: string;
    cardColor: string;
    cardColor2?: string;
    cardColor3?: string;
}

const slides: SlideData[] = [
    {
        id: 1,
        title: "Do you want real meetups, without endless chat?",
        subtitle: "Small weekly activities with real people, not feeds",
        cardColor: "#d6e3e9",
        cardColor2: "#ffdd7b",
        cardColor3: "#fde8e8"
    },
    {
        id: 2,
        title: "Do small-group activities feel like your pace?",
        subtitle: "Breakfasts, walks, dinners, join or suggest your own",
        cardColor: "#fde8e8",
        cardColor2: "#ffdd7b"
    },
    {
        id: 3,
        title: "Would curated groups help you settle faster?",
        subtitle: "We match you within 24 hours, Real people only",
        cardColor: "#ffdd7b"
    }
];

export default function IntroductionCarousel() {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            const nextSlide = currentSlide + 1;
            setCurrentSlide(nextSlide);
            scrollViewRef.current?.scrollTo({
                x: nextSlide * width,
                animated: true
            });
        } else {
            // Mark as completed and navigate to Init
            AsyncStorage.setItem('hasSeenIntroduction', 'true');
            navigation.replace("Init");
        }
    };

    const handleJoinButton = () => {
        // Mark as completed and navigate directly to SigninSignupNavigator
        AsyncStorage.setItem('hasSeenIntroduction', 'true');
        navigation.replace("SigninSignupNavigator");
    };

    const handleSkip = () => {
        AsyncStorage.setItem('hasSeenIntroduction', 'true');
        navigation.replace("Init");
    };

    const renderSlide = (slide: SlideData, index: number) => (
        <View key={slide.id} style={styles.slide}>
            <View style={styles.content}>
                {/* Logo Header */}
                <View style={styles.logoHeader}>
                    <View style={styles.logoIconContainer}>
                        <Image 
                            source={logoImage} 
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.logoText}>BREAKICE</Text>
                </View>

                {/* Cards */}
                <View style={styles.cardsContainer}>
                    {slide.cardColor3 && (
                        <View style={[styles.card, styles.cardRotated2, { backgroundColor: slide.cardColor3 }]} />
                    )}
                    {slide.cardColor2 && (
                        <View style={[styles.card, styles.cardRotated, { backgroundColor: slide.cardColor2 }]} />
                    )}
                    <View style={[styles.card, styles.cardMain, { backgroundColor: slide.cardColor }]}>
                        <Text style={styles.cardTitle}>{slide.title}</Text>
                        <Text style={styles.cardSubtitle}>{slide.subtitle}</Text>
                    </View>
                </View>

                {/* Action Buttons - Hidden for all slides */}

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.joinButton} onPress={handleJoinButton}>
                        <Text style={styles.joinButtonText}>Join Breakice — it's free</Text>
                    </TouchableOpacity>
                    <Text style={styles.signupText}>Signup takes 60 seconds.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={handleNext}>
                        <Text style={styles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={styles.scrollView}
            >
                {slides.map((slide, index) => renderSlide(slide, index))}
            </ScrollView>
            
            {/* Page Indicators */}
            <View style={styles.indicators}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            index === currentSlide && styles.activeIndicator
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5f1',
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width,
        height,
        backgroundColor: '#faf5f1',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 41,
        paddingBottom: 20,
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        height: 87,
        paddingRight: 16,
    },
    logoIconContainer: {
        width: 72,
        height: 72,
        marginRight: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcon: {
        width: 36,
        height: 36,
    },
    logoText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 26,
        fontWeight: '700',
        color: '#E23D3D',
        letterSpacing: 4.83,
    },
    title: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 28,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    cardsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 380,
        marginTop: 20,
        marginBottom: 40,
        position: 'relative',
    },
    card: {
        width: 240,
        height: 380,
        borderRadius: 12,
        position: 'absolute',
    },
    cardMain: {
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontFamily: 'SF Pro Rounded',
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 20,
    },
    cardSubtitle: {
        fontFamily: 'Rubik',
        fontSize: 12,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 18,
    },
    cardRotated: {
        transform: [{ rotate: '9.77deg' }],
        marginLeft: 18,
        marginTop: -18,
        zIndex: 2,
    },
    cardRotated2: {
        transform: [{ rotate: '350.376deg' }],
        marginLeft: -18,
        marginTop: 18,
        zIndex: 1,
    },
    subtitle: {
        fontFamily: 'Rubik',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        gap: 20,
    },
    skipButton: {
        backgroundColor: '#f1f5f7',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 86,
    },
    skipButtonText: {
        fontFamily: 'Rubik',
        fontSize: 16,
        fontWeight: '400',
        color: '#191919',
        textAlign: 'center',
    },
    yesButton: {
        backgroundColor: 'rgba(255,255,255,0.66)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 86,
    },
    yesButtonText: {
        fontFamily: 'Rubik',
        fontSize: 16,
        fontWeight: '400',
        color: '#191919',
        textAlign: 'center',
    },
    bottomButtons: {
        alignItems: 'center',
        gap: 16,
        marginTop: 40,
    },
    joinButton: {
        backgroundColor: '#e23d3d',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
        width: 271,
    },
    joinButtonText: {
        fontFamily: 'Rubik',
        fontSize: 20,
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
    },
    signupText: {
        fontFamily: 'Rubik',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 2,
    },
    loginButton: {
        borderWidth: 1,
        borderColor: '#000000',
        paddingHorizontal: 47,
        paddingVertical: 12,
        borderRadius: 8,
        width: 271,
    },
    loginButtonText: {
        fontFamily: 'Rubik',
        fontSize: 20,
        fontWeight: '400',
        color: '#1c1c1c',
        textAlign: 'center',
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d1d5db',
    },
    activeIndicator: {
        backgroundColor: '#e23d3d',
    },
});
