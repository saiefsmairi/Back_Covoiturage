import React, { useState, useRef, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Icon, Input, Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, VStack, Stack, NativeBaseProvider, FlatList, Spacer } from "native-base";
import axios from "axios";
import { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function SearchTrips({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [searchQueryDropPoint, setSearchQueryDropPoint] = useState('');
    const [searchQueryPickPoint, setSearchQueryPickPoint] = useState('');
    const [autocompleteResultsDropPoint, setAutocompleteResultsDropPoint] = useState([]);
    const [autocompleteResultsPickPoint, setAutocompleteResultsPickPoint] = useState([]);
    const [showDropPointFlatList, setshowDropPointFlatList] = useState(false);
    const [showPickupPointFlatList, setshowPickupPointFlatList] = useState(false);
    const [pickupLocationCords, setPickupLocationCords] = useState([]);
    const [dropLocationCords, setDropLocationCords] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedLocation2, setSelectedLocation2] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const pickupInputRef = useRef(null);
    const mapRef = useRef(null);

    const [currentLocation, setCurrentLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            // Request permission to access location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            // Get the user's current location
            let { coords } = await Location.getCurrentPositionAsync({});
            console.log(coords)
            setCurrentLocation(coords);
        })();
        pickupInputRef.current.focus()

    }, []);


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

    const handleSelectLocation = (item) => {
        console.log('Location coordinates:', item.geometry.coordinates);
        setSearchQueryDropPoint(item.properties.formatted)
        setDropLocationCords(item.geometry.coordinates)
        mapRef.current.animateToRegion({
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });


    };

    const handleSelectLocationPickPoint = (item) => {
        console.log('Location coordinates:', item.geometry.coordinates);
        setPickupLocationCords(item.geometry.coordinates)
        mapRef.current.animateToRegion({
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });

        setSearchQueryPickPoint(item.properties.formatted)
    };


    const hideFlatLists = () => {
        setshowDropPointFlatList(false);
        setshowPickupPointFlatList(false);
    };

    const generateKey = (item) => {
        return `${item.properties.formatted}-${item.properties.city}-${item.properties.country}`;
    };

    const showDatePicker = () => {
        setModalVisible(true);
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const handleConfirmDates = () => {
        setModalVisible(false);
    }


    const handlePressSearchTrip = async () => {
        navigation.navigate('listTrips', {
            userPickupLatitude: pickupLocationCords[1],
            userPickupLongitude: pickupLocationCords[0],
            userDropLatitude: dropLocationCords[1],
            userDropLongitude: dropLocationCords[0],
            selectedDate: selectedDate
        });
    };

    const handlePressCurrentLocation = async () => {
        console.log(currentLocation)
        const { latitude,longitude  } = currentLocation
        if (focusedInput === 'pickup') {
            setPickupLocationCords([longitude, latitude]);
            setSearchQueryPickPoint(`${latitude},${longitude}`);
        } else if (focusedInput === 'drop') {
            setDropLocationCords([longitude, latitude]);
            setSearchQueryDropPoint(`${latitude},${longitude}`);
        }
        mapRef.current.animateToRegion({
            latitude: latitude,
            longitude:longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });

    };

    const handleMapPress = async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        try {
            const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=fad74474846544cfa2e35a5f60a3b11e`;
            axios.get(apiUrl)
                .then(response => {
                    console.log(response.data.results[0].formatted)
                    if (focusedInput === 'pickup') {
                        setPickupLocationCords([longitude, latitude]);
                        console.log([longitude, latitude])
                        //setSearchQueryPickPoint(`${latitude},${longitude}`);
                        setSearchQueryPickPoint(response.data.results[0].formatted);

                    } else if (focusedInput === 'drop') {
                        setDropLocationCords([longitude, latitude]);
                        //setSearchQueryDropPoint(`${latitude},${longitude}`); 
                        setSearchQueryDropPoint(response.data.results[0].formatted);
                    }
                })
                .catch(error => {
                    console.log('Error reverse geocoding api:', error);
                });
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <TouchableWithoutFeedback onPress={hideFlatLists}>

            <View style={{ flex: 1 }}>
                <Stack style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, marginTop: 10 }} >
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
                            ref={pickupInputRef}
                            placeholder="Where to pick you from ?"
                            onFocus={() => {
                                setshowPickupPointFlatList(searchQueryPickPoint.length > 0)
                                setFocusedInput('pickup');

                            }}

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
                            onFocus={() => {
                                setshowDropPointFlatList(searchQueryDropPoint.length > 0)
                                setFocusedInput('drop')
                            }}
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
                            <TextInput onTouchStart={showDatePicker} value={selectedDate}
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
                    onPress={handleMapPress}

                >

                    {pickupLocationCords.length > 0 && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocationCords[1],
                                longitude: pickupLocationCords[0],
                            }}
                        />
                    )}

                    {dropLocationCords.length > 0 && (
                        <Marker
                            coordinate={{
                                latitude: dropLocationCords[1],
                                longitude: dropLocationCords[0],
                            }}
                        />
                    )}

                    {selectedLocation && (
                        <Marker
                            coordinate={selectedLocation}
                            pinColor="blue"
                            draggable
                            onDragEnd={(event) => {
                                const { latitude, longitude } = event.nativeEvent.coordinate;
                                setSelectedLocation({ latitude, longitude });
                                if (searchQueryPickPoint === '') {
                                    // If no pick-up point is selected, update the pick-up location
                                    setPickupLocationCords([longitude, latitude]);
                                    setSearchQueryPickPoint(''); // Clear previous search query if any
                                } else if (searchQueryDropPoint === '') {
                                    // If no drop-off point is selected, update the drop-off location
                                    setDropLocationCords([longitude, latitude]);
                                    setSearchQueryDropPoint(''); // Clear previous search query if any
                                }
                            }}
                        />
                    )}

                    {selectedLocation2 && (
                        <Marker
                            coordinate={selectedLocation2}
                            pinColor="green"
                            draggable
                            onDragEnd={(event) => {
                                const { latitude, longitude } = event.nativeEvent.coordinate;
                                setSelectedLocation2({ latitude, longitude });
                                if (searchQueryPickPoint === '') {
                                    // If no pick-up point is selected, update the pick-up location
                                    setPickupLocationCords([longitude, latitude]);
                                    setSearchQueryPickPoint(''); // Clear previous search query if any
                                } else if (searchQueryDropPoint === '') {
                                    // If no drop-off point is selected, update the drop-off location
                                    setDropLocationCords([longitude, latitude]);
                                    setSearchQueryDropPoint(''); // Clear previous search query if any
                                }
                            }}
                        />
                    )}
                </MapView>
                <TouchableOpacity style={styles.button} onPress={handlePressSearchTrip} disabled={!selectedDate || !searchQueryPickPoint || !searchQueryDropPoint} >
                    <Text style={styles.textStyle}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locations} onPress={handlePressCurrentLocation} >
                    <MaterialIcons name="my-location" size={24} color="black" />
                </TouchableOpacity>
                <Modal isVisible={modalVisible} backdropColor={"black"} backdropOpacity={0.70} animationType="slide">
                    <View style={styles.modal} >
                        <Calendar
                            onDayPress={handleDayPress}

                            markedDates={{
                                [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}>
                            <TouchableOpacity style={styles.dateButtons} onPress={() => setModalVisible(false)}>
                                <Text style={styles.textStyle2}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateButtons} onPress={handleConfirmDates}>
                                <Text style={styles.textStyle2}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
        borderRadius: 10,
        marginBottom: 5,
    },
    locations: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    dateButtons: {
        alignItems: "center",
        padding: 10,
    },
    textStyle: {
        color: "grey",
    },
    textStyle2: {
        color: "yellow",
        fontWeight: 500
    },
    modal: {

        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
