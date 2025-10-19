import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';
import { Square } from "lucide-react-native";

interface MicButtonProps {
    onPress: () => void;
    isRecording: boolean;
    disabled?: boolean;
}

const LucideStopIcon = (props: any) => (
    <Square
        size={props.style.width || 24}
        color={props.style.tintColor || 'white'}
    />
);

const MicButton = ({ onPress, isRecording, disabled = false }: MicButtonProps) => (
    <View style={styles.container}>
        <Button
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={disabled}
            appearance="filled"
            accessoryLeft={isRecording ? LucideStopIcon : undefined}
        >
            {isRecording ? undefined : <Text style={styles.startText}>Start recording</Text>}
        </Button>
        {isRecording && (
            <Text style={styles.stopText}>Stop recording</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        width: 173,
        height: 173,
        borderRadius: 173 / 2,
        backgroundColor: '#E23D3D',
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    startText: {
        fontFamily: 'Rubik-Medium',
        fontSize: 20,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    stopText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default MicButton;