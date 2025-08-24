import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';

import styles, { colors } from '../../../../../styles';

type AdventureType = "city-starters" | "social-recharge" | "after-work-flow" | "build-your-own";

interface AdventureCardProps {
    type: AdventureType;
    title: string;
    description: string;
    emoji: string;
    element: string;
    elementColor: string;
    quote: string;
    tags: string[];
    isActive?: boolean;
    status?: string;
}

const AdventureCard: React.FC<AdventureCardProps> = ({
    type,
    title,
    description,
    emoji,
    element,
    elementColor,
    quote,
    tags,
    isActive = true,
    status
}) => {
    const cardStyle = {
        ...styles.card,
        marginBottom: 16,
        opacity: isActive ? 1 : 0.6,
    };

    const handlePress = () => {

    };

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={handlePress}
            disabled={!isActive}
            activeOpacity={isActive ? 0.7 : 1}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 20, marginRight: 8 }}>{emoji}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.gray900 }}>{title}</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: colors.gray600, marginBottom: 8 }}>{description}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: elementColor }}>{element}</Text>
                    {status && (
                        <View style={{ 
                            backgroundColor: colors.gray100, 
                            paddingHorizontal: 8, 
                            paddingVertical: 2, 
                            borderRadius: 6,
                            marginTop: 4,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 11, color: colors.gray500 }}>{status}</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={{ fontSize: 14, color: colors.gray600, fontStyle: 'italic', marginBottom: 12 }}>
                "{quote}"
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {tags.map((tag, index) => (
                    <View key={index} style={{
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.gray200,
                        borderRadius: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        marginRight: 8,
                        marginBottom: 4,
                    }}>
                        <Text style={{ fontSize: 12, color: colors.gray900 }}>{tag}</Text>
                    </View>
                ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: colors.gray500 }}>3 weeks • 3–4 people</Text>
            </View>
        </TouchableOpacity>
    );
};

export default AdventureCard;
