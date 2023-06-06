import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Divider, Stack, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, NativeBaseProvider, ScrollView } from "native-base";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Toast from 'react-native-toast-message';
import { FontAwesome5 } from '@expo/vector-icons';

const RideDetails = ({ handlePress, route }) => {
    const [trip, setTrip] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        console.log(route.params.trip)
        setTrip(route.params.trip)

        const fetchTrips = async () => {
            try {
                const response = await axios.get('https://1318-102-159-105-67.ngrok-free.app/api/User/2');
                console.log(response.data)
                setUser(response.data)
            } catch (error) {
                console.log('Error fetching trips:', error);
            }
        };

        fetchTrips();


    }, []);

    const requestRide = {
        "status": "Pending",
        "tripId": trip.tripId,
        "driverId": trip.userId,
        "passengerId": 1,
    };


    const createRequestRide = async () => {
        console.log("pressed")
        try {
            const response = await axios.post(`https://cc55-102-159-105-67.ngrok-free.app/api/Trip/${trip.tripId}/request-rides`, requestRide);
            console.log(response.data)
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your request has been sent.',
            });
            return response.data;
        } catch (error) {
            // Handle error
            console.log('Error creating request ride:', error);
            throw error;
        }
    };


    return (
        <ScrollView>
            <Box mx="7" my="2" >
                <Box
                    overflow="hidden"
                    borderColor="coolGray.200"
                    borderWidth="1"
                    _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700",
                    }}
                    _web={{
                        shadow: 8,
                        borderWidth: 0,
                    }}
                    _light={{
                        backgroundColor: "gray.50",
                    }}
                >
                    <Box  >
                        <Stack space={2} >
                            <Stack space={2} >
                                <Image
                                    source={{ uri: 'https://images.prismic.io/shacarlacca/NmQ5ODc5NzYtNGQwYy00NzQzLWI0YzgtYWVjZWU5YzdkNmNh__10.jpg?auto=compress%2Cformat&rect=0%2C0%2C1600%2C900&w=1200&h=1200' }}
                                    style={{ width: '100%', height: 120 }}
                                    alt='car'
                                />
                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="center" marginTop={'-30px'}>
                                <Box mr={4}>
                                    <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                                </Box>
                                <Box >
                                    <Avatar
                                        size="xl"
                                        bg="green.500"
                                        source={{
                                            uri:
                                                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                                        }}
                                        alt="Trip destination2"
                                    >
                                    </Avatar>
                                </Box>
                                <Box ml={4}>
                                    <AntDesign name="phone" size={24} color="black" />
                                </Box>
                            </Stack>

                            <Divider
                                w="80%"
                                alignSelf={'center'}
                                _light={{ bg: "muted.300" }}
                                _dark={{ bg: "muted.50" }}
                            />

                            <Stack space={1} padding={1}  >
                                <Heading size="sm" ml="1">
                                    Trip info
                                </Heading>
                                <Stack direction="row" space={4} alignItems="center" ml="1"  >
                                    <MaterialCommunityIcons name="map-marker-radius" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        {trip.source}
                                    </Text>

                                </Stack>
                                <Stack direction="row" space={4} alignItems="center" ml="1"  >
                                    <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        {trip.destination}

                                    </Text>

                                </Stack>
                                <Stack direction="row" space={4} alignItems="center" ml="1"  >
                                    <AntDesign name="calendar" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        {new Date(trip.dateDebut).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}
                                        {' '}
                                        to
                                        {' '}
                                        {new Date(trip.dateFin).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}

                                    </Text>

                                </Stack>
                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <Ionicons name="md-time-outline" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        Departure time : {trip.departureTime}

                                    </Text>
                                </Stack>
                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <MaterialIcons name="timer" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        Arrival time : {trip.estimatedTime} min  (Estimated)

                                    </Text>
                                </Stack>
                                <Stack direction="row" space={4} alignItems="center" ml="1" >
                                    <MaterialCommunityIcons name="seat-passenger" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        {trip.availableSeats} Seats Available
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack direction="row" alignItems="center" justifyContent="center" space={5}>
                                <Box style={styles.card}>
                                    {trip.smoke ? (
                                        <FontAwesome5 name="smoking" size={24} color="black" />
                                    ) : (
                                        <MaterialIcons name="smoke-free" size={24} color="black" />
                                    )}
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        Smoke
                                    </Text>
                                </Box>

                                <Box style={styles.card}>
                                    {trip.food ? (
                                        <Ionicons name="fast-food-outline" size={24} color="black" />
                                    ) : (
                                        <MaterialIcons name="no-food" size={24} color="black" />)}
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        Food
                                    </Text>
                                </Box>


                                <Box style={styles.card}>
                                    {trip.music ? (
                                        <Ionicons name="musical-notes-outline" size={24} color="black" />
                                    ) : (
                                        <MaterialCommunityIcons name="music-off" size={24} color="black" />
                                    )}
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        Music
                                    </Text>
                                </Box>
                            </Stack>
                            <Stack space={3}  >
                                <TouchableOpacity style={styles.button} onPress={createRequestRide}>
                                    <Text style={styles.textStyle}>Send Ride Request</Text>
                                </TouchableOpacity>
                            </Stack>
                        </Stack>


                    </Box>
                </Box>
            </Box>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#eede1d",
        padding: 10,
    },

    textStyle: {
        color: "#2c2c3b",
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: '#f2f2f2',
        borderWidth: 0,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 2,
        padding: 15

    },
});

export default RideDetails;


