import React, { useState, useRef } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Icon, Input, Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, VStack, Stack, NativeBaseProvider, FlatList, Spacer } from "native-base";
import axios from "axios";

import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchTrips({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedDates, setSelectedDates] = React.useState({});
    const [showFlatLists, setShowFlatLists] = React.useState(false);


    const mapRef = useRef(null);

    const handlePress = ({ }) => {
        console.log("pressed button")
        navigation.navigate('rideDetails');
    };
    const handleConfirmDates = () => {
        setModalVisible(false);
        console.log(selectedDates);
    }

    const handleSelectDates = () => {
        setModalVisible(true);
    }
    const [searchQueryDropPoint, setSearchQueryDropPoint] = useState('');
    const [searchQueryPickPoint, setSearchQueryPickPoint] = useState('');
    const [autocompleteResultsDropPoint, setAutocompleteResultsDropPoint] = useState([]);
    const [autocompleteResultsPickPoint, setAutocompleteResultsPickPoint] = useState([]);
    const [showDropPointFlatList, setshowDropPointFlatList] = useState(false);
    const [showPickupPointFlatList, setshowPickupPointFlatList] = useState(false);
    const [pickupLocationCords, setPickupLocationCords] = useState([]);
    const [dropLocationCords, setDropLocationCords] = useState([]);

    const handleSearchDropPointQueryChange = async (query) => {
        setSearchQueryDropPoint(query);

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&filter=countrycode:tn&apiKey=fad74474846544cfa2e35a5f60a3b11e`
        );
        const data = await response.json();
        setAutocompleteResultsDropPoint(data.features);
        if (!query) {
            setAutocompleteResultsDropPoint([]);
        }
        setshowDropPointFlatList(query.length > 0);

    };

    const handleSearchPickPointQueryChange = async (query) => {
        setSearchQueryPickPoint(query);

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&filter=countrycode:tn&apiKey=fad74474846544cfa2e35a5f60a3b11e`
        );
        const data = await response.json();
        setAutocompleteResultsPickPoint(data.features);
        if (!query) {
            setAutocompleteResultsPickPoint([]);
        }
        setshowPickupPointFlatList(query.length > 0);

    };

    const handleSelectLocation = (item) => {
        console.log('Location coordinates:', item.geometry.coordinates);
        setSearchQueryDropPoint(item.properties.formatted)
        setDropLocationCords(item.geometry.coordinates)

    };

    const handleSelectLocationPickPoint = (item) => {
        console.log('Location coordinates:', item.geometry.coordinates);
        setPickupLocationCords(item.geometry.coordinates)

        setSearchQueryPickPoint(item.properties.formatted)
    };


    const hideFlatLists = () => {
        setshowDropPointFlatList(false);
        setshowPickupPointFlatList(false);
    };

    const generateKey = (item) => {
        return `${item.properties.formatted}-${item.properties.city}-${item.properties.country}`;
    };


    const handlePressSearchTrip = async () => {

        navigation.navigate('listTrips', {
            userPickupLatitude: pickupLocationCords[1],
            userPickupLongitude: pickupLocationCords[0],
            userDropLatitude: dropLocationCords[1],
            userDropLongitude: dropLocationCords[0],
        });
    };

    return (
        <TouchableWithoutFeedback onPress={hideFlatLists}>

            <View style={{ flex: 1 }}>
                <Stack style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0 }} >
                    <Stack >

                        <TextInput
                            style={{

                                backgroundColor: 'white',
                                paddingHorizontal: 20,
                                paddingVertical: 7,
                                marginHorizontal: 20,
                                marginTop: 20,
                                borderWidth: 1,
                                borderColor: '#ccc',
                            }}
                            value={searchQueryPickPoint}
                            onChangeText={handleSearchPickPointQueryChange}
                            placeholder="Where to pick you from ?"
                            onFocus={() => setshowPickupPointFlatList(searchQueryPickPoint.length > 0)}

                        />
                        {showPickupPointFlatList && (
                            <Box>
                                <FlatList
                                    style={{
                                        backgroundColor: 'white',
                                        marginVertical: 5,
                                        marginHorizontal: 20,
                                    }}
                                    data={autocompleteResultsPickPoint}
                                    renderItem={({ item }) => (
                                        <Box
                                            borderBottomWidth="1"
                                            _dark={{ borderColor: "muted.50" }}
                                            borderColor="muted.300"
                                            pl={["4", "4"]}
                                            pr={["5", "5"]}
                                            py="2"
                                            key={generateKey(item)}
                                        >
                                            <HStack space={[2, 3]} justifyContent="space-between">
                                                <VStack>
                                                    <TouchableWithoutFeedback onPress={() => {
                                                        handleSelectLocationPickPoint(item);
                                                        setAutocompleteResultsPickPoint([]);
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
                                    keyExtractor={(item) => generateKey(item)}


                                />
                            </Box>
                        )}

                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                paddingHorizontal: 20,
                                paddingVertical: 7,
                                marginHorizontal: 20,
                                marginTop: 5,
                                borderWidth: 1,
                                borderColor: '#ccc',
                            }}
                            value={searchQueryDropPoint}
                            onChangeText={handleSearchDropPointQueryChange}
                            placeholder="Hey, Where you plan to go ?"
                            onFocus={() => setshowDropPointFlatList(searchQueryDropPoint.length > 0)}
                        />

                        {showDropPointFlatList && (
                            <Box>
                                <FlatList
                                    style={{
                                        backgroundColor: 'white',
                                        marginVertical: 5,
                                        marginHorizontal: 20,
                                    }}
                                    data={autocompleteResultsDropPoint}

                                    renderItem={({ item }) => (
                                        <Box
                                            borderBottomWidth="1"
                                            _dark={{ borderColor: "muted.50" }}
                                            borderColor="muted.300"
                                            pl={["4", "4"]}
                                            pr={["5", "5"]}
                                            py="2"
                                            key={generateKey(item)}
                                        >
                                            <HStack space={[2, 3]} justifyContent="space-between">
                                                <VStack>
                                                    <TouchableWithoutFeedback onPress={() => {
                                                        handleSelectLocation(item);
                                                        setAutocompleteResultsDropPoint([]);
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
                                    keyExtractor={(item) => generateKey(item)}

                                />
                            </Box>
                        )}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                paddingHorizontal: 5,
                                paddingVertical: 7,
                                marginHorizontal: 20,
                                marginTop: 5,
                                borderWidth: 1,
                                borderColor: '#ccc',
                            }}
                        >
                            <MaterialIcons name="date-range" size={24} color="#ccc" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Which date?"
                            />
                        </View>
                    </Stack>
                </Stack>
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 36.84776375,
                        longitude: 10.175588638998654,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >

                </MapView>
                <TouchableOpacity style={styles.button} onPress={handlePressSearchTrip} >
                    <Text style={styles.textStyle}>Search</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>

    );
}



const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardText: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        marginHorizontal: 100,
        marginTop: 5,
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderRadius: 10
    },
    dateButtons: {
        alignItems: "center",
        padding: 10,
    },
    textStyle: {
        color: "grey",
    },
});
