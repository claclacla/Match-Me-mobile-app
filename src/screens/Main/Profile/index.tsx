import { Layout, Text } from '@ui-kitten/components';

import styles from '../../../styles';

const ProfileScreen = () => {
    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Profile</Text>
        </Layout>
    );
};

export default ProfileScreen;