import React, { useState, useRef } from "react";
import { Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, VStack, Stack, NativeBaseProvider, FlatList, Spacer, Input, Icon } from "native-base";
import { View, TouchableOpacity, TextInput, TouchableWithoutFeedback } from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const MapComponent = ({route}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    const navigation = useNavigation();

    const handleSearchQueryChange = async (query) => {
        setSearchQuery(query);

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=fad74474846544cfa2e35a5f60a3b11e`
        );
        const data = await response.json();
        setAutocompleteResults(data.features);
        if (!query) {
            setAutocompleteResults([]);

        }
    };

    const handleSelectLocation = (item) => {
        console.log('Selected location:', item.properties.formatted);
        console.log('Location coordinates:', item.geometry.coordinates);
        setSearchQuery(item.properties.formatted)
        setSelectedLocation({
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
        });
        mapRef.current.animateToRegion({
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
   
         setTimeout(() => {

          route.params.onReturn( item);
          navigation.goBack()
        }, 2000); 

    };

    const hideFlatList = () => {
        setAutocompleteResults([]);
    };

    return (
        <TouchableWithoutFeedback onPress={hideFlatList}>

            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            marginHorizontal: 20,
                            marginTop: 30,
                            borderWidth: 1,
                            borderColor: '#ccc',
                        }}
                        value={searchQuery}
                        onChangeText={handleSearchQueryChange}
                        placeholder="Search for a location"
                    />
                    <Box>
                        <FlatList
                            style={{
                                backgroundColor: 'white',
                                marginVertical: 5,
                                marginHorizontal: 20,
                            }}
                            data={autocompleteResults}
                            renderItem={({ item }) => (
                                <Box
                                    borderBottomWidth="1"
                                    _dark={{ borderColor: "muted.50" }}
                                    borderColor="muted.300"
                                    pl={["4", "4"]}
                                    pr={["5", "5"]}
                                    py="2"
                                >
                                    <HStack space={[2, 3]} justifyContent="space-between">
                                        <VStack>
                                            <TouchableWithoutFeedback onPress={() => {
                                                handleSelectLocation(item);
                                                setAutocompleteResults([]);
                                            }}>
                                                <Text
                                                    _dark={{ color: "warmGray.50" }}
                                                    color="coolGray.800"
                                                    bold
                                                >
                                                    {item.properties.formatted}
                                                </Text>
                                            </TouchableWithoutFeedback >
                                        </VStack>
                                        <Spacer />
                                    </HStack>
                                </Box>
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </Box>

                </View>

                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 36.806389,
                        longitude: 10.181667,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                            }}
                        />
                    )}
                </MapView>

            </View>

        </TouchableWithoutFeedback>

    );
};

export default MapComponent;
