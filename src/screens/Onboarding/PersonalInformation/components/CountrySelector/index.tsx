import React, { useMemo, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

import styles from '../../../../../styles';
import { Layout } from '@ui-kitten/components';

countries.registerLocale(en);

type CountryDropdownProps = {
    selectedCountry?: string;
    onSelectCountry: (country: string) => void;
};

const CountryDropdown: React.FC<CountryDropdownProps> = ({ selectedCountry, onSelectCountry }) => {
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
                style={styles.select}
                data={countryList}
                labelField="label"
                valueField="value"
                placeholder="Select your country"
                value={value}
                onChange={handleChange}
                maxHeight={300}
                //search
                //searchPlaceholder="Search..."
            />
        </Layout>
    );
};

export default CountryDropdown;