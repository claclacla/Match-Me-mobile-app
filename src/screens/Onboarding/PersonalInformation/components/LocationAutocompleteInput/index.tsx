import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, Text as RNText, Keyboard } from 'react-native';
import { Input } from '@ui-kitten/components';

import { LOCATION_IQ } from "../../../../../config/config.json";
import { LocationData } from '../../../../../repositories/globalEntities/User';

export const LocationAutocompleteInput = ({
    onSelectLocation
}: {
    onSelectLocation: (location: LocationData | undefined) => void
}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // TO DO: Refactor the following call in an external API function 

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await fetch(
                `https://api.locationiq.com/v1/autocomplete?key=${LOCATION_IQ.KEY}&q=${encodeURIComponent(
                    query
                )}&limit=5&format=json`
            );

            const data = await response.json();

            if (Array.isArray(data)) {
                setSuggestions(data);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (err) {
            console.error('Location fetch failed:', err);

            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        //console.log(inputValue);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (inputValue.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const isInputValueInSuggestions = suggestions.some(
            (s) => s.display_name.toLowerCase() === inputValue.toLowerCase().trim()
        );

        if (isInputValueInSuggestions) {
            console.log("Skipping fetch: Input value is already a listed suggestion.");
            return;
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchSuggestions(inputValue.trim());
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [inputValue]);

    const handleSelect = useCallback((item: any) => {
        const locationData: LocationData = {
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        };

        setInputValue(item.display_name);
        setShowSuggestions(false);

        onSelectLocation(locationData);
    }, [onSelectLocation]);

    return (
        <View style={{ width: '100%' }}>
            <Input
                value={inputValue}
                placeholder="Enter a location"
                onChangeText={(text) => {
                    setInputValue(text);
                    onSelectLocation(undefined);
                }}
                style={{ marginBottom: 8 }}
                autoCapitalize="none"
                autoCorrect={false}
            />

            {showSuggestions && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) =>
                        (item.place_id?.toString() ?? item.osm_id?.toString() ?? '') + '-' + index.toString()
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSelect(item)}
                            style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                        >
                            <RNText>{item.display_name}</RNText>
                        </TouchableOpacity>
                    )}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        maxHeight: 200,
                        borderColor: '#ddd',
                        borderWidth: 1,
                        position: 'absolute',
                        zIndex: 1000,
                        top: 50,
                        width: '100%',
                    }}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </View>
    );
};