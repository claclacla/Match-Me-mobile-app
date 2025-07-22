import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { setUserProfileSectionStatus } from "../../../repositories/api/setUserProfileSectionStatus";

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import useAuthenticationStore from '../../../repositories/localStorage/useAuthenticationStore';
import useUserStore from '../../../repositories/localStorage/useUserStore';
import { PROFILE_SECTION_KEYS, PROFILE_SECTION_STATUS, User } from '../../../repositories/globalEntities/User';

import styles from '../../../styles';

const OnboardingGroupPersonalExperienceScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    const key: string = useAuthenticationStore((state: any) => state.key);
    const user: User = useUserStore((state: any) => state.user);

    const skip = async () => {
        await setUserProfileSectionStatus({ key, userId: user.id, section: PROFILE_SECTION_KEYS.GROUP_PERSONAL_EXPERIENCE, value: PROFILE_SECTION_STATUS.SKIPPED });
        navigation.replace('OnboardingNavigator', { screen: 'OnboardingComplete' });
    }

    return (
        <Layout style={[styles.container, { justifyContent: 'center', padding: 24 }]}>
            <Text category="h3" style={[styles.title, { textAlign: 'center', marginBottom: 16 }]}>
                Your personal experience
            </Text>

            <Button onPress={skip} style={styles.button}>
                Skip
            </Button>
        </Layout>
    );
};

export default OnboardingGroupPersonalExperienceScreen;
