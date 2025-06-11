import { useState } from 'react';
import { CompositeNavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { SignupScreensList } from '../../../screensList/SignupScreensList';
import { ApplicationScreensList } from '../../../screensList/ApplicationScreensList';
import { useAuthentication } from '../../../hooks/useAuthentication';

import styles from '../../../styles';

type SignupConfirmationScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<SignupScreensList, 'SignupConfirmation'>,
    StackNavigationProp<ApplicationScreensList>
>;

type SignupConfirmationScreenProps = StackScreenProps<SignupScreensList, 'SignupConfirmation'>;

const SignupConfirmationScreen = () => {
    const navigation = useNavigation<SignupConfirmationScreenNavigationProp>();

    const route = useRoute<SignupConfirmationScreenProps['route']>();
    const username = route.params?.username;

    const [confirmationCode, setConfirmationCode] = useState('');

    const { confirmSignUp } = useAuthentication();

    const handleConfirmationCode = async () => {
        try {
            await confirmSignUp({ username, confirmationCode });
        } catch (error: any) {

        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Send your confirmation code</Text>

            <Input
                style={styles.input}
                placeholder='Confirmation code'
                value={confirmationCode}
                onChangeText={setConfirmationCode}
                secureTextEntry
            />

            <Button
                style={styles.button}
                onPress={handleConfirmationCode}
            >
                Send confirmation code
            </Button>

            <Button
                style={styles.button}
                onPress={() => navigation.navigate('Signin')}
            >
                Go to sign in
            </Button>
        </Layout>
    );
}

export default SignupConfirmationScreen;