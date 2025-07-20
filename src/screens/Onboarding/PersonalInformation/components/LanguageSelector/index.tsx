import { Layout, Select, SelectItem, IndexPath } from '@ui-kitten/components';

import styles from '../../../../../styles';

interface LanguageSelectorProps {
    selectedLanguages: string[];
    setSelectedLanguages: (langs: string[]) => void;
}

const languages: string[] = [
    "English", "Italian", "Spanish", "French", "German",
    "Chinese", "Japanese", "Korean", "Russian", "Portuguese",
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguages,
    setSelectedLanguages,
}) => {
    const selectedIndexes = selectedLanguages
        .map(lang => {
            const index = languages.indexOf(lang);
            return index >= 0 ? new IndexPath(index) : null;
        })
        .filter((i): i is IndexPath => i !== null);

    const displayValue = selectedLanguages.length > 0
        ? selectedLanguages.join(', ')
        : undefined;  

    const onSelect = (index: IndexPath | IndexPath[]) => {
        const indexesArray = Array.isArray(index) ? index : [index];
        const selected = indexesArray.map(i => languages[i.row]);
        setSelectedLanguages(selected);
    };

    return (
        <Layout style={styles.select}>
            <Select
                multiSelect={true}
                selectedIndex={selectedIndexes}
                onSelect={onSelect}
                placeholder="Select languages"
                value={displayValue}  
            >
                {languages.map((lang) => (
                    <SelectItem key={lang} title={lang} />
                ))}
            </Select>
        </Layout>
    );
};

export default LanguageSelector;
