import React from 'react';
import {
    Input,
    Text,
} from '@ui-kitten/components';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import countries from 'world-countries';

import styles from '../../styles';

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
    const selectedCountry = countryList.find((c) => c.dialCode === selectedPrefix);

    const onSelect = (item: Country) => {
        setSelectedPrefix(item.dialCode);
    };

    const renderItem = (item: Country) => {
        return (
            <View style={{
                padding: 10,
                backgroundColor: '#fff'
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, marginRight: 8 }}>{item.flag}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginRight: 8 }}>({item.dialCode})</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: '#333', flex: 1 }}>{item.name}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ width: "100%" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{
                    flex: 0.7,
                    marginRight: 0,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRightWidth: 0,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    paddingHorizontal: 12
                }}>
                    <Dropdown
                        style={{
                            flex: 1,
                            height: 40,
                        }}
                        placeholderStyle={{
                            fontSize: 14,
                            color: '#666',
                            fontWeight: '400'
                        }}
                        selectedTextStyle={{
                            fontSize: 14,
                            color: '#333',
                            fontWeight: '500'
                        }}
                        inputSearchStyle={{
                            fontSize: 14,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8
                        }}
                        iconStyle={{
                            width: 20,
                            height: 20
                        }}
                        data={countryList}
                        //search
                        maxHeight={300}
                        labelField="name"
                        valueField="dialCode"
                        placeholder={selectedCountry ? `${selectedCountry.flag} ${selectedCountry.dialCode}` : "Select country"}
                        //searchPlaceholder="Search..."
                        value={selectedPrefix}
                        onChange={onSelect}
                        renderLeftIcon={() => (
                            <Text style={{ fontSize: 18, marginRight: 8 }}>
                                {selectedCountry?.flag}
                            </Text>
                        )}
                        renderItem={renderItem}
                        containerStyle={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                        activeColor="#F3F4F6"
                    />
                </View>
                <Input
                    style={[styles.input, {
                        flex: 1,
                        marginBottom: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    }]}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>
        </View>
    );
};

export default PhoneNumberInput;