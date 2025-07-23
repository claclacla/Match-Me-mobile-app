import { StyleSheet, TouchableOpacity } from 'react-native';
import { Mic } from "lucide-react-native";

import styles from '../../../../../styles';

const MicButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity style={styles.micButton} onPress={onPress} activeOpacity={0.7}>
        <Mic color="white" size={48} />
    </TouchableOpacity>
);

export default MicButton;