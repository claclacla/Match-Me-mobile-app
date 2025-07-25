import { View } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from '../../../repositories/globalEntities/User';

import MicButton from './components/MicButton';

import styles from '../../../styles';

const OnboardingGroupPersonalExperienceRecordingScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);

    const handleRecord = async () => {

    }

    const handleSkip = async () => {
        await setUserProfileSectionStatus({ key, userId: user.id, section: PROFILE_SECTION_KEYS.GROUP_PERSONAL_EXPERIENCE, value: PROFILE_SECTION_STATUS.SKIPPED });
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingGroupBehaviorInsightsCover' });
    }

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>If you feel like it</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Leave a short voice message.</Text>
                <Text style={styles.subtitle}>Say something about yourself. Anything you’d like this space to reflect.</Text>

                <Text style={styles.subtitle}>You can talk about how you feel today.</Text>
                <Text style={styles.subtitle}>Or how you move in relation to others.</Text>
                <Text style={styles.subtitle}>Or simply let your voice carry a feeling.</Text>

                <Text style={styles.subtitle}>We’ll use this to give your presence shape here. Not to judge. But to hold.</Text>
            </Layout>

            <MicButton onPress={() => console.log('Record pressed')} />

            <Button onPress={handleSkip} style={styles.button}>
                Skip
            </Button>
        </Layout>
    );
}

export default OnboardingGroupPersonalExperienceRecordingScreen;