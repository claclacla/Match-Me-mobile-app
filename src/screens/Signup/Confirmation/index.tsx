import { useState, useMemo } from 'react';
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

    const [confirmationCode, setConfirmationCode] = useState<string>('');

    const { confirmSignUp } = useAuthentication();

    // Form validation
    const isFormValid = useMemo(() => {
        return confirmationCode.trim() !== '';
    }, [confirmationCode]);

    const handleConfirmationCode = async () => {
        if (!isFormValid) {
            return;
        }

        try {
            await confirmSignUp({ username, confirmationCode: confirmationCode.trim() });
            navigation.replace('Signin');
        } catch (error: any) {
            console.error('Confirmation error:', error);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Enter your confirmation code</Text>

            <Input
                style={styles.input}
                placeholder='Confirmation code'
                value={confirmationCode}
                onChangeText={setConfirmationCode}
                secureTextEntry
                status={confirmationCode !== '' && confirmationCode.trim() === '' ? 'danger' : 'basic'}
                caption={confirmationCode !== '' && confirmationCode.trim() === '' ? 'Confirmation code cannot be empty' : ''}
            />

            <Button
                style={isFormValid ? styles.button : styles.buttonDisabled}
                onPress={handleConfirmationCode}
                disabled={!isFormValid}
            >
                Enter confirmation code
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