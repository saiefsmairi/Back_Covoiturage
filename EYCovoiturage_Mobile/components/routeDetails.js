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

const RouteDetails = ({ route }) => {
  
    const mapRef = useRef(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const navigation = useNavigation();
    const [distance, setDistance] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);

    React.useEffect(() => {
        console.log(route.params.pickupLocationCords)
        console.log(route.params.dropLocationCords)
        const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=36.897710599999996,10.1896244|36.898454224969555,10.18844784459759&mode=drive&apiKey=fad74474846544cfa2e35a5f60a3b11e`;

        axios.get(apiUrl)
            .then(response => {

                const route = response.data.features[0].geometry.coordinates[0].map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(route);
            })

        axios.get(apiUrl)
            .then(response => {
                setDistance(response.data.features[0].properties.distance)
                setEstimatedTime(response.data.features[0].properties.time)

            })

            .catch(error => {
                console.log('Error fetching route:', error);
            });
    }, []);

    return (

        <View style={{ flex: 1 }}>

            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 36.897710599999996,
                    longitude: 10.1896244,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: 35.82993400160298,
                        longitude: 10.638493764822783,
                    }}
                    title={'Origin'}
                />
                <Marker
                    coordinate={{
                        latitude: 35.83235214518061,
                        longitude: 10.634803045218177,
                    }}
                    title={'Destination'}
                />

                <Polyline coordinates={routeCoordinates} strokeColor="#F00" strokeWidth={3} />

            </MapView>
            <View style={styles.card}>
                <Text style={styles.cardText}>Distance: {distance}  Meters</Text>
                <Text style={styles.cardText}>Estimated time: {estimatedTime} Sec</Text>
                <Stack   >
                    <TouchableOpacity style={styles.button} >
                        <Text style={styles.textStyle}>Next</Text>
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
  