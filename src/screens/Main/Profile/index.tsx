import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../../hooks/useAuthentication';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';

import styles from '../../../styles';

const ProfileScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const { signOut } = useAuthentication();
    
    const handleSignOut = async () => {
        await signOut();
        navigation.replace("Signin");
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Profile</Text>

            <Button
                appearance='outline'
                onPress={handleSignOut}
                style={styles.button}
                status='danger'
            >
                Sign out
            </Button>
        </Layout>
    );
};

export default ProfileScreen;