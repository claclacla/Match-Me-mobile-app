import { View, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

type PreferencesSelectorRouteProp = RouteProp<{
    PreferencesSelector: {
        adventureType: string;
    };
}, 'PreferencesSelector'>;

const MatcherPreferencesSelectorScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const route = useRoute<PreferencesSelectorRouteProp>();
    const { adventureType } = route.params;

    return (
        <Layout style={styles.container}>
            {/* Header Section */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <Text style={[styles.title, { textAlign: 'left', marginBottom: 16 }]}>
                    Your ideal group
                </Text>
                <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
                    Let us know your group preferences or skip this page
                </Text>
            </View>

            {/* Preferences Content */}
            <ScrollView
                style={{ flex: 1, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>

                </View>
            </ScrollView>
        </Layout>
    );
};

export default MatcherPreferencesSelectorScreen;
