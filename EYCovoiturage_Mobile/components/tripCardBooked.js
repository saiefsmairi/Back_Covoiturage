import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Modal, Text } from 'react-native';
import { Box, Stack, Badge, Divider, Avatar, Image } from 'native-base';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Circle, CircleSnail } from 'react-native-progress';
import { Feather } from 'react-native-vector-icons';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TripCardBooked = ({ trip }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [scannedTripId, setScannedTripId] = useState(null);
    const [matchedTrip, setMatchedTrip] = useState(null);
    const [userId, setUserId] = useState(trip.userId);
    const formattedDepartureTime = moment(trip.trip.departureTime, "HH:mm:ss").format("HH:mm");
    const departureTime = moment(trip.trip.departureTime, 'HH:mm:ss');
    const estimatedTime = trip.trip.estimatedTime;
    const arrivalTime = departureTime.add(estimatedTime, 'minutes');
    const [profileImage, setProfileImage] = useState('');
    useEffect(() => {

        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        const getProfileImage = async () => {
            const value = await AsyncStorage.getItem('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://6e65-197-2-231-204.ngrok-free.app/api/User/${userId}/profileImage`);
                const base64Image = response.data;
                setProfileImage(base64Image);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User does not have an image');
                } else {
                    console.log('Error retrieving profile image:', error);
                }
            }
        };
        getProfileImage();

    }, []);

    const handleScanQRCode = (tripId) => {
        setSelectedTripId(tripId)
        setShowScanner(true);
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setIsLoading(true);
        const parsedData = JSON.parse(data);
        const scannedtripId = parsedData.TripId;
        /*         console.log("scannedTripId")
                console.log(scannedtripId)
                console.log("selectedTripId")
                console.log(selectedTripId)
                console.log("reqqqq")
                console.log(trip.requestId)
         */
        setTimeout(() => {
            if (scannedtripId == selectedTripId) {
                console.log('Trip started');
                setMatchedTrip(true);
                handleMatchQrcode(trip.requestId, "Confirmed")

            } else {
                console.log('Scanned trip does not match the selected trip');
                setMatchedTrip(false);
            }

            setTimeout(() => {
                setIsLoading(false);
                setShowScanner(false);
                //  setMatchedTrip(null);
            }, 2000);
        }, 5000);
        setMatchedTrip(null);
    };

    const handleCloseScanner = () => {
        setIsLoading(false);
        setShowScanner(false);
    };

    const handleMatchQrcode = async (requestRideId, status) => {
        try {
            const response = await axios.put(`https://6e65-197-2-231-204.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };


    return (
        <TouchableOpacity onPress={handleScanQRCode}>
            <Box>
                <Box mx="7" my="2">
                    <Box
                        my="1"
                        rounded="lg"
                        overflow="hidden"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        _dark={{
                            borderColor: 'coolGray.600',
                            backgroundColor: 'gray.700',
                        }}
                        _web={{
                            shadow: 2,
                            borderWidth: 0,
                        }}
                        _light={{
                            backgroundColor: 'gray.50',
                        }}
                    >
                        <Box>
                            <Stack p="3" space={1}>
                                <Stack direction="row" alignItems="center">
                                    <MaterialCommunityIcons
                                        name="qrcode-scan"
                                        size={24}
                                        color="black"
                                        onPress={() => handleScanQRCode(trip.trip.tripId)}

                                    />
                                    <Badge
                                        colorScheme="success"
                                        alignSelf="center"
                                        variant="subtle"
                                        position="absolute"
                                        top={0}
                                        right={0}
                                    >
                                        UPCOMING
                                    </Badge>
                                </Stack>


                                <Stack direction="row" alignItems="center">
                                    <Stack space={2}>
                                        <Text
                                            fontSize="sm"
                                            _light={{ color: '#2e2e38' }}
                                            _dark={{ color: 'violet.400' }}
                                            fontWeight="500"
                                            ml="-0.5"
                                            mt="-1"
                                        >
                                            {formattedDepartureTime}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            _light={{ color: '#2e2e38' }}
                                            _dark={{ color: 'violet.400' }}
                                            fontWeight="500"
                                            ml="-0.5"
                                            mt="-1"
                                        >
                                            {arrivalTime.format('HH:mm')}
                                        </Text>
                                    </Stack>

                                    <Stack>
                                        <Entypo name="flow-line" size={35} color="#47a7f4" />
                                    </Stack>
                                    <Stack space={2} style={{ flex: 1 }}>
                                        <Text
                                            fontSize="sm"
                                            _light={{ color: '#2e2e38' }}
                                            _dark={{ color: 'violet.400' }}
                                            fontWeight="500"
                                            ml="-0.5"
                                            mt="-1"
                                            style={{ flexWrap: 'wrap', width: '100%' }}
                                        >
                                            {trip.trip.source}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            _light={{ color: '#2e2e38' }}
                                            _dark={{ color: 'violet.400' }}
                                            fontWeight="500"
                                            ml="-0.5"
                                            mt="-1"
                                            style={{ flexWrap: 'wrap', width: '100%' }}
                                        >
                                            {trip.trip.destination}
                                        </Text>
                                    </Stack>
                                </Stack>

                                <Divider
                                    w="100%"
                                    my="2"
                                    _light={{ bg: 'muted.300' }}
                                    _dark={{ bg: 'muted.50' }}
                                />
                                <Stack direction="row" alignItems="center">
                                    {profileImage ? (
                                        <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 10 }} alt="driverimg" />
                                    ) : (
                                        <Avatar bg="cyan.500" size="sm">
                                            {trip.createdBy && trip.createdBy.firstName.toUpperCase()}

                                        </Avatar>
                                    )}
                                    <Text ml="4" fontWeight="bold">
                                        {trip.createdBy && trip.createdBy.firstName} {trip.createdBy && trip.createdBy.lastName}

                                    </Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Box>

            </Box>
            <Modal visible={showScanner} animationType="slide">
                <Box flex={1} justifyContent="center" alignItems="center">
                    {hasPermission === null ? (
                        <Text>Requesting camera permission...</Text>
                    ) : hasPermission === false ? (
                        <Text>No access to camera</Text>
                    ) : (
                        <>
                            {!isLoading ? (
                                <BarCodeScanner
                                    onBarCodeScanned={handleBarCodeScanned}
                                    style={{ height: '100%', width: '100%' }}
                                />
                            ) : (
                                <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {matchedTrip === null ? (
                                        <>
                                            <CircleSnail color={['green', 'yellow', 'blue']} size={200} />
                                            <Text>Verifying...</Text>
                                        </>
                                    ) : matchedTrip ? (
                                        <>
                                            <Feather name="check-circle" size={50} color="green" />
                                            <Text>Matching trip found! Starting the trip...</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Feather name="x-circle" size={50} color="red" />
                                            <Text>Invalid trip. Please try again.</Text>
                                        </>
                                    )}
                                </Box>
                            )}
                            <TouchableOpacity
                                onPress={handleCloseScanner}
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    padding: 10,
                                    borderRadius: 20,
                                }}
                            >
                                <MaterialCommunityIcons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </>
                    )}
                </Box>
            </Modal>
        </TouchableOpacity>
    );
};

export default TripCardBooked;
