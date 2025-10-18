import { Dropdown } from 'react-native-element-dropdown';
import { Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import { GENDER_OPTIONS, UserGender } from '../../../../repositories/globalEntities/User';

interface GenderSelectorProps {
  selectedGender: UserGender | undefined;
  onSelectGender: (value: UserGender) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onSelectGender }) => {
    return (
        <Layout style={customStyles.selectContainer}>
            <Dropdown
                style={customStyles.select}
                containerStyle={customStyles.containerStyle}
                itemContainerStyle={customStyles.itemContainer}
                itemTextStyle={customStyles.itemText}
                placeholderStyle={customStyles.placeholderStyle}
                selectedTextStyle={customStyles.selectedTextStyle}
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

const customStyles = StyleSheet.create({
    selectContainer: {
        width: '100%',
        marginBottom: 16,
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
});

export default GenderSelector;
