import { View, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';
import AdventureCard from './components/AdventureCard';

type AdventureType = "city-starters" | "social-recharge" | "after-work-flow" | "build-your-own";

interface AdventureData {
    type: AdventureType;
    title: string;
    description: string;
    emoji: string;
    element: string;
    elementColor: string;
    quote: string;
    tags: string[];
    isActive: boolean;
    status?: string;
}

const adventuresData: AdventureData[] = [
    {
        type: "city-starters",
        title: "City Starters",
        description: "Grounding adventures for newcomers.",
        emoji: "🌱",
        element: "Earth 🟤",
        elementColor: "#D81E5B",
        quote: "You've just landed. Take your first look at the city together with fellow newcomers.",
        tags: ["🏙 City exploration", "☕ Cozy cafés", "🛍 Local markets"],
        isActive: true
    },
    {
        type: "social-recharge",
        title: "Social Recharge",
        description: "Flowing experiences for the curious.",
        emoji: "🌊",
        element: "Water 🔵",
        elementColor: "#2563eb",
        quote: "Break your routine and dive into the local vibe with other open-minded people ready to connect.",
        tags: ["🎨 Festivals", "🎶 Indie gigs", "🎭 Art galleries"],
        isActive: false,
        status: "Coming soon"
    },
    {
        type: "after-work-flow",
        title: "After-Work Flow",
        description: "Warming vibes to unwind.",
        emoji: "🔥",
        element: "Fire 🔴",
        elementColor: "#dc2626",
        quote: "Clock out, slow down. Relaxed evenings after work, perfect for casual conversations and zero pressure.",
        tags: ["🎲 Board games", "🌇 Rooftop aperitivo", "🍻 Casual drinks"],
        isActive: false,
        status: "Coming soon"
    },
    {
        type: "build-your-own",
        title: "Build Your Own",
        description: "Open-ended journey.",
        emoji: "💨",
        element: "Air ⚪",
        elementColor: "#6b7280",
        quote: "Pick your 3 favorite activities, and we'll form a custom group for you.",
        tags: ["🛠 Custom activities selected by user"],
        isActive: false,
        status: "Locked"
    }
];

const MatcherAdventureSelectorScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

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
                {adventuresData.map((adventure, index) => (
                    <AdventureCard
                        key={adventure.type}
                        type={adventure.type}
                        title={adventure.title}
                        description={adventure.description}
                        emoji={adventure.emoji}
                        element={adventure.element}
                        elementColor={adventure.elementColor}
                        quote={adventure.quote}
                        tags={adventure.tags}
                        isActive={adventure.isActive}
                        status={adventure.status}
                    />
                ))}
            </ScrollView>
        </Layout>
    );
};

export default MatcherAdventureSelectorScreen;