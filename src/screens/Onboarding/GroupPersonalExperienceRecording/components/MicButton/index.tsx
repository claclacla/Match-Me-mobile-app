import { Mic } from "lucide-react-native";
import { Button } from '@ui-kitten/components';

import styles from '../../../../../styles';

const LucideMicIcon = (props: any) => (
    <Mic
        size={props.style.width || 24}
        color={props.style.tintColor || 'white'}
    />
);

const MicButton = ({ onPress }: { onPress: () => void }) => (
    <Button
        appearance='filled'
        accessoryLeft={LucideMicIcon}
        onPress={onPress}
        style={styles.button}
    >
        Record
    </Button>
);

export default MicButton;