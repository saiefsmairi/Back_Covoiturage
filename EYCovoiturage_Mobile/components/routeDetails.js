import React, { useState, useRef } from "react";
import { Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, VStack, Stack, NativeBaseProvider, FlatList, Spacer, Input, Icon } from "native-base";
import { View, TouchableOpacity, TextInput, TouchableWithoutFeedback, StyleSheet } from "react-native";
import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RouteDetails = ({ route }) => {

    const mapRef = useRef(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const navigation = useNavigation();
    const [userStorage, setUserStorage] = useState('');
    const [distanceAff, setDistanceAff] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [trip, setTrip] = useState({
        source: "Jaafer",
        destination: "Los Angeles",
        availableSeats: 3,
        distance: 2789,
        type: "regular",
        EstimatedTime: 10,
        availableDates: [],
        pickupLatitude: '',
        pickupLongitude: '',
        dropLatitude: '',
        dropLongitude: '',
        departureTimeInput: '',
        userId: ''
    });
    const pickupLocationCords = route.params.pickupLocationCords
    const dropLocationCords = route.params.dropLocationCords
    const TripDepartureTime = route.params.selectedTime
    React.useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('user');
                if (value !== null) {
                    const user = JSON.parse(value);
                    setUserStorage(user);
                } else {
                    // Handle case when user data is not available
                }
            } catch (error) {
                // Handle error while retrieving user data
            }
        };

        getData();
    }, []);

    React.useEffect(() => {


        const fetchData = async () => {
            try {
                const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${pickupLocationCords[1]},${pickupLocationCords[0]}|${dropLocationCords[1]},${dropLocationCords[0]}&mode=drive&apiKey=fad74474846544cfa2e35a5f60a3b11e`;

                axios.get(apiUrl)
                    .then(response => {
                        const distance = (response.data.features[0].properties.distance / 1000).toFixed(2);
                        const time = Math.round(response.data.features[0].properties.time / 60);

                        setDistanceAff(distance);
                        setEstimatedTime(time)
                        /*         const route = response.data.features[0].geometry.coordinates[0].map(coord => ({
                                    latitude: coord[1],
                                    longitude: coord[0],
                                }));
                                setRouteCoordinates(route); */
                        setTrip(prevTrip => ({ ...prevTrip, distance: distance, EstimatedTime: time }));
                    })
                    .catch(error => {
                        console.log('Error fetching route:', error);
                    });
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
        const dates = Object.keys(route.params.selectedDates).map((date) => {
            return {
                date: date
            }
        })

        setTrip(prevTrip => ({ ...prevTrip, availableDates: dates }));
        setTrip(prevTrip => ({ ...prevTrip, source: route.params.pickupLocation }));
        setTrip(prevTrip => ({ ...prevTrip, destination: route.params.dropLocation }));
        setTrip(prevTrip => ({ ...prevTrip, departureTimeInput: TripDepartureTime }));
        setTrip(prevTrip => ({ ...prevTrip, pickupLatitude: pickupLocationCords[1] }));
        setTrip(prevTrip => ({ ...prevTrip, pickupLongitude: pickupLocationCords[0] }));
        setTrip(prevTrip => ({ ...prevTrip, dropLatitude: dropLocationCords[1] }));
        setTrip(prevTrip => ({ ...prevTrip, dropLongitude: dropLocationCords[0] }));
        setTrip(prevTrip => ({ ...prevTrip, userId: userStorage.id }));

    }, [userStorage]);


    const handleCreateTrip = () => {
        navigation.navigate('finalAddTrip', {
            trip
        });

        /*    console.log(trip)
           axios.post("https://cc55-102-159-105-67.ngrok-free.app/api/Trip", trip)
               .then((response) => {
                   console.log("Trip created successfully!", response.data);
                   navigation.navigate('listTrips');
               })
               .catch((error) => {
                   console.error(error.response.data);
               }); */
    };

    return (
        <View style={{ flex: 1 }}>

            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: pickupLocationCords[1],
                    longitude: pickupLocationCords[0],
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: pickupLocationCords[1],
                        longitude: pickupLocationCords[0],
                    }}
                    title={'Pickup'}
                />
                <Marker
                    coordinate={{
                        latitude: dropLocationCords[1],
                        longitude: dropLocationCords[0],
                    }}
                    title={'Destination'}
                />

                {/*  <Polyline coordinates={routeCoordinates} strokeColor="#F00" strokeWidth={3} /> */}

            </MapView>
            <View style={styles.card}>
                <Text style={styles.cardText}>Distance: {distanceAff}  Km</Text>
                <Text style={styles.cardText}>Estimated time: {estimatedTime} Min</Text>
                <Stack   >
                    <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
                        <Text style={styles.textStyle}>Proceed</Text>
                    </TouchableOpacity>
                </Stack>
            </View>

        </View>
    );
};

export default RouteDetails;

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
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
        backgroundColor: "#2c2c3b",
        padding: 10,
        width: 200
    },
    dateButtons: {
        alignItems: "center",
        padding: 10,
    },
    textStyle: {
        color: "yellow",
        fontWeight: 500
    },
});
