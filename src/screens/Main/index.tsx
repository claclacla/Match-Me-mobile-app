import React, { useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

//import { useNavigation } from '@react-navigation/native';
//import { SigninScreenProp } from '../../nativeStackScreenProp/SigninScreenProps';

import { findSimilarUsersById } from '../../repositories/api/findSimilarUsersById';

import useAuthenticationStore from '../../repositories/localStorage/useAuthenticationStore';

const MainScreen = () => {
    //const navigation = useNavigation<SigninScreenProp['navigation']>();
    const key = useAuthenticationStore((state: any) => state.key);

    useEffect(() => {
        if(key === undefined) {
            return;
        }

        console.log(key);

        const findSimilarUsersByIdWithKey = async () => {
            const response: string = await findSimilarUsersById({ key });
            console.log(response);
        };

        findSimilarUsersByIdWithKey();
    }, [key]);

    //const goBack = () => {
    //    navigation.goBack();
    //};

    return (
        <Layout style={styles.container}>
            <Text category='h3' style={styles.title}>Main page</Text>

            {/*<Button onPress={goBack} style={styles.button}>
                Go back
            </Button>*/}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginBottom: 20,
    },
    button: {
        marginTop: 30,
        width: '80%',
    }
});

export default MainScreen;