import { Dropdown } from 'react-native-element-dropdown';
import { Layout } from '@ui-kitten/components';

import { GENDER_OPTIONS, UserGender } from '../../../../../repositories/globalEntities/User';

import styles from '../../../../../styles';

interface GenderSelectorProps {
  selectedGender: UserGender | undefined;
  onSelectGender: (value: UserGender) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onSelectGender }) => {
    return (
        <Layout style={styles.selectContainer}>
            <Dropdown
                style={styles.select}
                //placeholderStyle={styles.placeholderStyle}
                //selectedTextStyle={styles.selectedTextStyle}
                data={GENDER_OPTIONS.map(opt => ({ label: opt.label, value: opt.value }))}
                labelField="label"
                valueField="value"
                placeholder="Select your gender"
                value={selectedGender}
                onChange={(item) => onSelectGender(item.value as UserGender)}
            />
        </Layout>
    );
};

export default GenderSelector;
