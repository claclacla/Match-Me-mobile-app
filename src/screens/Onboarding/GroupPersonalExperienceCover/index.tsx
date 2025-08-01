import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import styles from '../../../styles';

const OnboardingGroupPersonalExperienceCoverScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const user = useUserStore((state: any) => state.user);

    const handleContinue = async () => {
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupPersonalExperienceIntro' });
    };

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Welcome, {user?.name || 'there'}!</Text>

            {user?.avatar && (
                <View style={{ 
                    alignItems: 'center', 
                    marginVertical: 20,
                    marginBottom: 30
                }}>
                    <Image
                        source={{ uri: user.avatar }}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            borderWidth: 3,
                            borderColor: '#E4E9F2'
                        }}
                        resizeMode="cover"
                    />
                </View>
            )}

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>You're in a space where attention matters.</Text>
                <Text style={styles.subtitle}>Where being heard comes before being seen.</Text>
                <Text style={styles.subtitle}>What follows isn't about being right</Text>
                <Text style={styles.subtitle}>It's about being real.</Text>
            </Layout>

            <Button onPress={handleContinue} style={styles.button}>
                Continue
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceCoverScreen;