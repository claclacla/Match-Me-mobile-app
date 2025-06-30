import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        padding: 20,
        paddingTop: 100,
        width: '100%',
    },
    title: {
        marginBottom: 30,
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    multiLineInput: {
        width: '100%',
        marginBottom: 15,
        minHeight: 120,
        //paddingTop: 10,
        //paddingBottom: 10
    },
    select: {
        width: "100%",
        marginVertical: 8,
    },
    button: {
        width: '100%',
        marginTop: 10,
    },
    ghostButton: {
        marginTop: 10,
    },
});

export default styles;