import React from 'react';
import {
    Layout,
    Select,
    SelectItem,
    IndexPath,
    Input,
    Text,
} from '@ui-kitten/components';
import { View } from 'react-native';
import countries from 'world-countries';

function getFlagEmoji(countryCode: string) {
    return countryCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

interface Country {
    code: string; // ISO 2-letter code
    name: string;
    dialCode: string;
    flag: string;
}

const countryList: Country[] = countries.map((country) => ({
    code: country.cca2,
    name: country.name.common,
    dialCode: country.idd.root + (country.idd.suffixes?.[0] ?? ''),
    flag: getFlagEmoji(country.cca2),
}));

interface PhoneNumberInputProps {
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    selectedPrefix: string;
    setSelectedPrefix: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    phoneNumber,
    setPhoneNumber,
    selectedPrefix,
    setSelectedPrefix,
}) => {
    const selectedIndex = new IndexPath(
        countryList.findIndex((c) => c.dialCode === selectedPrefix)
    );

    const onSelect = (index: IndexPath | IndexPath[]) => {
        const selected = Array.isArray(index) ? index[0] : index;
        const selectedCountry = countryList[selected.row];
        setSelectedPrefix(selectedCountry.dialCode);
    };

    const renderOption = (country: Country) => (
        <SelectItem
            key={country.code}
            // Use a function for the title prop to render custom content
            title={() => (
                <View>
                    <Text>{country.flag} ({country.dialCode})</Text>
                    <Text style={{ flexShrink: 1 }}>{country.name}</Text>
                </View>
            )}
        />
    );

    const renderValue = () => {
        const selectedCountry = countryList.find(
            (c) => c.dialCode === selectedPrefix
        );
        return (
            <Text>
                {selectedCountry?.flag} {selectedCountry?.dialCode}
            </Text>
        );
    };

    return (
        <Layout style={{ width: "100%" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Select
                    style={{ flex: 0.7, marginRight: 0 }}
                    selectedIndex={selectedIndex}
                    onSelect={onSelect}
                    value={renderValue()}
                >
                    {countryList.map(renderOption)}
                </Select>
                <Input
                    style={{ flex: 1 }}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>
        </Layout>
    );
};

export default PhoneNumberInput;