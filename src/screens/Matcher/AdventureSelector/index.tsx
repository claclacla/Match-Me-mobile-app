import { Button, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { ApplicationNavigationProp } from '../../../stackNavigationProps/ApplicationNavigationProp';
import styles from '../../../styles';

const MatcherAdventureSelectorScreen = () => {
    const navigation = useNavigation<ApplicationNavigationProp>();

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Match with your adventure</Text>

            <Layout style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Choose your adventure and start matching with people who share your interests.</Text>
            </Layout>

        </Layout>
    );
};

export default MatcherAdventureSelectorScreen;