import { MultiSelect } from 'react-native-element-dropdown';
import { Layout } from '@ui-kitten/components';

import styles from '../../../../../styles';

interface LanguageSelectorProps {
    selectedLanguages: string[];
    setSelectedLanguages: (langs: string[]) => void;
}

const languages: string[] = [
    "English", "Italian", "Spanish", "French", "German",
    "Chinese", "Japanese", "Korean", "Russian", "Portuguese",
];

const languageOptions = languages.map(lang => ({
    label: lang,
    value: lang,
}));

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguages,
    setSelectedLanguages,
}) => {
    return (
        <Layout style={styles.selectContainer}>
            <MultiSelect
                style={styles.select}
                //placeholderStyle={styles.placeholderStyle}
                //selectedTextStyle={styles.selectedTextStyle}
                //inputSearchStyle={styles.inputSearchStyle}
                data={languageOptions}
                labelField="label"
                valueField="value"
                placeholder="Select languages"
                value={selectedLanguages}
                onChange={(item: string[]) => {
                    setSelectedLanguages(item);
                }}
                //selectedStyle={styles.selectedStyle}
            />
        </Layout>
    );
};

/*
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
*/

export default LanguageSelector;