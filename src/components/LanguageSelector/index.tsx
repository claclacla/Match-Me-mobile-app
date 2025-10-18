import { MultiSelect } from 'react-native-element-dropdown';
import { Layout } from '@ui-kitten/components';
import { StyleSheet, View, Text } from 'react-native';

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
    const displayText = selectedLanguages.length > 0 
        ? selectedLanguages.join(', ') 
        : 'Select your languages';

    return (
        <Layout style={customStyles.selectContainer}>
            <MultiSelect
                style={customStyles.select}
                containerStyle={customStyles.containerStyle}
                itemContainerStyle={customStyles.itemContainer}
                itemTextStyle={customStyles.itemText}
                placeholderStyle={customStyles.placeholderStyle}
                selectedTextStyle={customStyles.selectedTextStyle}
                selectedStyle={customStyles.selectedStyle}
                renderSelectedItem={() => <View />}
                data={languageOptions}
                labelField="label"
                valueField="value"
                placeholder=""
                value={selectedLanguages}
                onChange={(item: string[]) => {
                    setSelectedLanguages(item);
                }}
                renderInputSearch={() => null}
            />
            <Text 
                style={[customStyles.overlayText, selectedLanguages.length > 0 ? { color: '#000000' } : { color: '#818080' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {displayText}
            </Text>
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

const customStyles = StyleSheet.create({
    selectContainer: {
        width: '100%',
        marginBottom: 16,
        position: 'relative',
    },
    select: {
        width: "100%",
        height: 44,
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 17,
        backgroundColor: '#F3EFED',
    },
    containerStyle: {
        backgroundColor: '#F3EFED',
        borderRadius: 8,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContainer: {
        backgroundColor: '#F3EFED',
        borderBottomWidth: 0,
    },
    itemText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        paddingVertical: 1,
    },
    placeholderStyle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: '#818080',
    },
    selectedTextStyle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
    },
    selectedStyle: {
        backgroundColor: '#E8E0DD',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginHorizontal: 4,
        marginVertical: 2,
    },
    overlayText: {
        position: 'absolute',
        left: 17,
        right: 40,
        top: 12,
        fontFamily: 'Rubik-Regular',
        fontSize: 18,
        fontWeight: '400',
        pointerEvents: 'none',
        overflow: 'hidden',
    },
});

export default LanguageSelector;