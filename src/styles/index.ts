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
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        width: "100%"
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    rowContainer: {
        flexDirection: 'row', // Arranges children horizontally
        justifyContent: 'space-between', // Distributes space evenly between inputs
        marginBottom: 15, // Add margin bottom for spacing from next element
    },
    halfInput: {
        flex: 1, // Each input takes equal available space
        marginHorizontal: 2, // Add horizontal margin for spacing between inputs
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
        marginBottom: 15,
    },
    button: {
        width: '100%',
        marginTop: 10,
    },
    ghostButton: {
        marginTop: 10,
    },
    micButton: {
        backgroundColor: '#3D85C6',
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;