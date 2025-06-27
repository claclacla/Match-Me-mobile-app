import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface AnimatedFeedbackProps {
    message: string;
    onAnimationEnd?: () => void;
}

const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({ message, onAnimationEnd }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // opacity from 0 to 1
    const translateY = useRef(new Animated.Value(20)).current; // start 20px below

    useEffect(() => {
        // Animate fade in and move up, then fade out and move up more
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(700),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            if (onAnimationEnd) onAnimationEnd();
        });
    }, [fadeAnim, translateY, onAnimationEnd]);

    return (
        <Animated.Text
            style={[
                styles.feedbackText,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                },
            ]}
        >
            {message}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    feedbackText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#3366FF',
        marginTop: 10,
    },
});

export default AnimatedFeedback;