import { Layout, Text } from '@ui-kitten/components';

import styles from '../../../styles';

const ChatScreen = () => {
    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Chat</Text>
        </Layout>
    );
};

export default ChatScreen;