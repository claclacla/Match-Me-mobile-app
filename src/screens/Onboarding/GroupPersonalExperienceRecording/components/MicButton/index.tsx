import { Mic, Square } from "lucide-react-native";
import { Button } from '@ui-kitten/components';

import styles from '../../../../../styles';

const LucideMicIcon = (props: any) => (
    <Mic
        size={props.style.width || 24}
        color={props.style.tintColor || 'white'}
    />
);

const LucideStopIcon = (props: any) => (
    <Square
        size={props.style.width || 24}
        color={props.style.tintColor || 'white'}
    />
);

interface MicButtonProps {
    onPress: () => void;
    isRecording: boolean;
    disabled?: boolean;
}

const MicButton = ({ onPress, isRecording, disabled = false }: MicButtonProps) => (
    <Button
        appearance='filled'
        accessoryLeft={isRecording ? LucideStopIcon : LucideMicIcon}
        onPress={onPress}
        style={disabled ? styles.micButtonDisabled : styles.micButton}
        disabled={disabled}
    >
    </Button>
);

export default MicButton;