import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles, { colors } from '../../../styles';

type AdventureType = "city-starters" | "social-recharge" | "after-work-flow" | "build-your-own";

const MatcherAdventureSelectorScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const renderAdventureCard = (
        type: AdventureType,
        title: string,
        description: string,
        emoji: string,
        element: string,
        elementColor: string,
        quote: string,
        tags: string[],
        isActive: boolean = true,
        status?: string
    ) => {
        const cardStyle = {
            ...styles.card,
            marginBottom: 16,
            opacity: isActive ? 1 : 0.6,
        };

        function handleAdventureSelect(type: string): void {
            throw new Error('Function not implemented.');
        }

        return (
            <TouchableOpacity
                style={[cardStyle]}
                onPress={() => isActive && handleAdventureSelect(type)}
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

    return (
        <Layout style={styles.container}>
            {/* Header Section */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <Text style={[styles.title, { textAlign: 'left', marginBottom: 16 }]}>
                    Find your group to start a new social adventure.
                </Text>
                <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
                    Choose your path: you'll break the ice in 3 weekly meetups. One meetup a week. Same group, new light activities each time, to listen, talk, and have fun!
                </Text>
            </View>

            {/* Adventure Cards */}
            <ScrollView 
                style={{ flex: 1, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {renderAdventureCard(
                    "city-starters",
                    "City Starters",
                    "Grounding adventures for newcomers.",
                    "🌱",
                    "Earth 🟤",
                    "#D81E5B",
                    "You've just landed. Take your first look at the city together with fellow newcomers.",
                    ["🏙 City exploration", "☕ Cozy cafés", "🛍 Local markets"],
                    true
                )}

                {renderAdventureCard(
                    "social-recharge",
                    "Social Recharge",
                    "Flowing experiences for the curious.",
                    "🌊",
                    "Water 🔵",
                    "#2563eb",
                    "Break your routine and dive into the local vibe with other open-minded people ready to connect.",
                    ["🎨 Festivals", "🎶 Indie gigs", "🎭 Art galleries"],
                    false,
                    "Coming soon"
                )}

                {renderAdventureCard(
                    "after-work-flow",
                    "After-Work Flow",
                    "Warming vibes to unwind.",
                    "🔥",
                    "Fire 🔴",
                    "#dc2626",
                    "Clock out, slow down. Relaxed evenings after work, perfect for casual conversations and zero pressure.",
                    ["🎲 Board games", "🌇 Rooftop aperitivo", "🍻 Casual drinks"],
                    false,
                    "Coming soon"
                )}

                {renderAdventureCard(
                    "build-your-own",
                    "Build Your Own",
                    "Open-ended journey.",
                    "💨",
                    "Air ⚪",
                    "#6b7280",
                    "Pick your 3 favorite activities, and we'll form a custom group for you.",
                    ["🛠 Custom activities selected by user"],
                    false,
                    "Locked"
                )}
            </ScrollView>

        </Layout>
    );
};

export default MatcherAdventureSelectorScreen;