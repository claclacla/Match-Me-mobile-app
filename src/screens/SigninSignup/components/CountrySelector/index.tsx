import React, { useMemo, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet } from 'react-native';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

import styles from '../../../../styles';
import { Layout } from '@ui-kitten/components';

countries.registerLocale(en);

type CountryDropdownProps = {
    selectedCountry?: string;
    onSelectCountry: (country: string) => void;
    placeholder?: string;
};

const CountryDropdown: React.FC<CountryDropdownProps> = ({ selectedCountry, onSelectCountry, placeholder = "Select your country" }) => {
    const countryList = useMemo(() => {
        const names = countries.getNames('en', { select: 'official' });

        return Object.values(names)
            .sort((a, b) => a.localeCompare(b))
            .map(name => ({ label: name, value: name }));
    }, []);

    const [value, setValue] = useState<string | undefined>(selectedCountry);

    useEffect(() => {
        setValue(selectedCountry);
    }, [selectedCountry]);

    const handleChange = (item: { label: string; value: string }) => {
        setValue(item.value);
        onSelectCountry(item.value);
    };

    return (
        <Layout style={styles.selectContainer}>
            <Dropdown
                style={customStyles.dropdown}
                containerStyle={customStyles.dropdownContainer}
                itemContainerStyle={customStyles.itemContainer}
                itemTextStyle={customStyles.itemText}
                data={countryList}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                placeholderStyle={customStyles.placeholderStyle}
                selectedTextStyle={customStyles.selectedTextStyle}
                value={value}
                onChange={handleChange}
                maxHeight={200}
                //search
                //searchPlaceholder="Search..."
            />
        </Layout>
    );
};

const customStyles = StyleSheet.create({
    dropdown: {
        width: "100%",
        height: 44,
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 17,
        backgroundColor: '#F3EFED', // Same as text inputs
    },
    dropdownContainer: {
        backgroundColor: '#F3EFED', // Same background as input
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
        backgroundColor: '#F3EFED', // Same background as input
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

export default CountryDropdown;