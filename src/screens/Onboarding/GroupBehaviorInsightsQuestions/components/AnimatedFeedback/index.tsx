import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

interface AnimatedFeedbackProps {
    message: string;
    onAnimationEnd?: () => void;
}

const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({ message, onAnimationEnd }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // opacity from 0 to 1
    const translateY = useRef(new Animated.Value(20)).current; // start 20px below

    useEffect(() => {
        const timeout = setTimeout(() => {
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
        }, 0);

        return () => clearTimeout(timeout);
    }, [message, onAnimationEnd]);

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
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        marginTop: 10,
        letterSpacing: -0.5,
    },
});

export default AnimatedFeedback;