import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useState } from 'react';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles, { colors } from '../../../styles';
import LanguageSelector from '../../../components/LanguageSelector';

type PreferencesSelectorRouteProp = RouteProp<{
    PreferencesSelector: {
        adventureType: string;
    };
}, 'PreferencesSelector'>;

const MatcherPreferencesSelectorScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const route = useRoute<PreferencesSelectorRouteProp>();

    const { adventureType } = route.params;
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [sameGenderPreference, setSameGenderPreference] = useState<'yes' | 'no' | null>(null);

    const GenderOption = ({ value, label, isSelected, onPress }: {
        value: 'yes' | 'no';
        label: string;
        isSelected: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: isSelected ? colors.primaryLight : colors.gray50,
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.gray200,
                width: '100%',
            }}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : colors.gray400,
                backgroundColor: isSelected ? colors.primary : 'transparent',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {isSelected && (
                    <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.white,
                    }} />
                )}
            </View>
            <Text style={{
                fontSize: 16,
                color: isSelected ? colors.primary : colors.gray700,
                fontWeight: isSelected ? '600' : '400',
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const handleContinue = () => {
        // TODO: Submit preferences and start matching
        console.log('Selected languages:', selectedLanguages);
        console.log('Same gender preference:', sameGenderPreference);
        console.log('Adventure type:', adventureType);
        
        // Navigate to next screen or trigger matching
        navigation.replace('MainNavigator', { screen: 'MainMatch' });
    };

    return (
        <Layout style={[styles.container, { justifyContent: 'flex-start', paddingTop: 80 }]}>
            <ScrollView 
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    Your ideal group
                </Text>
                <Text style={[styles.subtitle, { marginBottom: 56 }]}>
                    Let us know your group preferences or skip this page
                </Text>

                <Text style={[styles.subtitle, { textAlign: 'left' }]}>
                    Do you prefer your group to have a specific language in common?
                </Text>
                <LanguageSelector
                    selectedLanguages={selectedLanguages}
                    setSelectedLanguages={setSelectedLanguages}
                />

                <Text style={[styles.subtitle, { textAlign: 'left' }]}>
                    Are you looking for a group of persons the same gender as you?
                </Text>
                <GenderOption
                    value="yes"
                    label="Yes, I prefer same gender"
                    isSelected={sameGenderPreference === 'yes'}
                    onPress={() => setSameGenderPreference('yes')}
                />
                <GenderOption
                    value="no"
                    label="No, I'm open to any gender"
                    isSelected={sameGenderPreference === 'no'}
                    onPress={() => setSameGenderPreference('no')}
                />
            </ScrollView>

            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20 }}>
                <Button 
                    onPress={handleContinue}
                    style={styles.button}
                >
                    Start Matching
                </Button>
            </View>
        </Layout>
    );
};

export default MatcherPreferencesSelectorScreen;
