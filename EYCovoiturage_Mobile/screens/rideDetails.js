import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Box, Divider, Stack, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, NativeBaseProvider, ScrollView } from "native-base";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Toast from 'react-native-toast-message';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Communications from 'react-native-communications';
import { useNavigation } from '@react-navigation/native';
import UserAvatar from 'react-native-user-avatar';

const RideDetails = ({ handlePress, route }) => {
    const [trip, setTrip] = useState('');
    const [user, setUser] = useState('');
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isRequestCreated, setIsRequestCreated] = useState(false);
    const [userStorage, setUserStorage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [carImage, setcarImage] = useState('');
    const [userGetData, setUserGetData] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        console.log("*/*/*/*/")
        console.log(route.params.trip.user)
        console.log(route.params.trip.trip.availableDates)
        setTrip(route.params.trip.trip);
        setUser(route.params.trip.user)

        const getCarInfo = async (userId) => {
            try {
                const response = await axios.get(`https://cb18-102-157-92-55.ngrok-free.app/api/User/${route.params.trip.trip.userId}/carImage`);
                const base64Image = response.data.base64Image;
                setcarImage(base64Image)
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User does not have a car image');
                } else {
                    console.log('Error retrieving car image:', error);
                }
            }
        };
        getCarInfo(); // Fetch car image separately
        const getProfileImage = async () => {
            try {
                const response = await axios.get(`https://cb18-102-157-92-55.ngrok-free.app/api/User/${route.params.trip.trip.userId}/profileImage`);
                const base64Image = response.data;
                setProfileImage(base64Image);
                const userResponse = await axios.get(`https://cb18-102-157-92-55.ngrok-free.app/api/User/${route.params.trip.trip.userId}`);
                setUserGetData(userResponse.data)

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User does not have an image');
                } else {
                    console.log('Error retrieving profile image:', error);
                }
            }
        };
        getProfileImage();

        const getData = async (key) => {
            try {
                const value = await SecureStore.getItemAsync('user');
                if (value !== null) {
                    setUserStorage(JSON.parse(value))
                    return value;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        };
        getData();
        const fetchData = async () => {
            try {
                const value = await SecureStore.getItemAsync('user');
                var userId = JSON.parse(value).id
                const userResponse = await axios.get(`https://cb18-102-157-92-55.ngrok-free.app/api/User/${userId}`);
                const checkRequestExists = async () => {
                    try {
                        const response = await axios.get(`https://cb18-102-157-92-55.ngrok-free.app/api/Trip/${route.params.trip.trip.tripId}/users/${userResponse.data.id}/check-request`);
                        console.log(response.data);
                        setIsRequestSent(response.data);
                    } catch (error) {
                        console.log('Error checking request:', error);
                    }
                };

                checkRequestExists();
            } catch (error) {
                console.log('Error fetching trips:', error);
            }
        };

        fetchData();
    }, [isRequestCreated]);

    const requestRide = {
        "status": "Pending",
        "tripId": trip.tripId,
        "driverId": trip.userId,
        "passengerId": userStorage.id,
    };

    const createRequestRide = async () => {
        console.log(requestRide);

        try {
            const response = await axios.post(`https://cb18-102-157-92-55.ngrok-free.app/api/Trip/${trip.tripId}/request-rides`, requestRide);
            console.log(response.data)
            setIsRequestCreated(true);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your request has been sent.',
            });
            return response.data;
        } catch (error) {
            console.log('Error creating request ride:', error);
            throw error;
        }
    };

    const makePhoneCall = (phoneNumber) => {
        console.log(phoneNumber)
        const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, '');
        Communications.phonecall(phoneNumberWithoutSpaces, true);
    };

    const handleNavigateChat = () => {
        navigation.navigate('chat', {
            receiverId: route.params.trip.trip.userId
        });

    };

    return (
        <ScrollView  >
            <Box mx="7" my="2"  >
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

                                {carImage ? (
                                    <Image source={{ uri: `data:image/jpeg;base64,${carImage}` }} style={{ width: '100%', height: 120 }}
                                        alt='car' />
                                ) : (
                                    <Heading size="sm" ml="1">

                                    </Heading>
                                )}
                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="center" marginTop={'-30px'}>
                                {userGetData.isVerifiedPhoneNumber && (
                                    <Box mr={4}>
                                        <MaterialIcons name="verified" size={24} color="#0095f6" />
                                        {/*    <Ionicons name="chatbox-ellipses-outline" size={24} color="black"  onPress={handleNavigateChat} /> */}
                                    </Box>
                                )}

                                <Box >
                                    {profileImage ? (
                                        <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={{ width: 100, height: 100, borderRadius: 50 }} alt="driverimg" />
                                    ) : (
                                        <UserAvatar size={80} name={route.params.trip.user.firstName} bgColor="#2596be"  />


                                    )}
                                </Box>

                                {userGetData.isVerifiedPhoneNumber && (
                                    <Box ml={4}>
                                        <AntDesign name="phone" size={24} color="black" onPress={() => makePhoneCall('+21629162035')} />
                                    </Box>
                                )}

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

                                <Stack direction="row" space={4} ml="1">
                                    <AntDesign name="calendar" size={24} color="black" />
                                    <Stack direction="row" space={6} flexWrap="wrap" >
                                        {trip.availableDates?.map((dateObj, index) => (
                                            <Text
                                                key={dateObj.tripDatesId}
                                                fontSize="xs"
                                                _light={{ color: "muted.600" }}
                                                _dark={{ color: "violet.400" }}
                                                fontWeight="500"
                                                ml="-0.5"
                                                mt="1"
                                            >
                                                {new Date(dateObj.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}
                                            </Text>
                                        ))}
                                    </Stack>
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
                                <Stack direction="row" space={4} alignItems="center" ml="1" >
                                    <MaterialCommunityIcons name="card-text-outline" size={24} color="black" />
                                    <Text
                                        fontSize="xs"
                                        _light={{ color: "muted.600" }}
                                        _dark={{ color: "violet.400" }}
                                        fontWeight="500"
                                        ml="-0.5"
                                        mt="-1"
                                    >
                                        {trip.description}
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
                            <Stack space={5}>
                                <TouchableOpacity
                                    style={[styles.button, { opacity: isRequestSent ? 0.5 : 1, marginTop: 10 }]}
                                    onPress={createRequestRide}
                                    disabled={isRequestSent}
                                >
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


