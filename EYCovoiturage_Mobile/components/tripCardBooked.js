import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Modal, Text } from 'react-native';
import { Box, Stack, Badge, Divider, Avatar, Image, CheckIcon, DeleteIcon, CloseIcon, SmallCloseIcon } from 'native-base';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Circle, CircleSnail } from 'react-native-progress';
import { Feather } from 'react-native-vector-icons';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from 'react-native-user-avatar';
import { AlertDialog, Button, Center, NativeBaseProvider } from "native-base";


const TripCardBooked = ({ trip, fetchAcceptedTrips }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [scannedTripId, setScannedTripId] = useState(null);
    const [matchedTrip, setMatchedTrip] = useState(null);
    const formattedDepartureTime = moment(trip.trip.departureTime, "HH:mm:ss").format("HH:mm");
    const departureTime = moment(trip.trip.departureTime, 'HH:mm:ss');
    const estimatedTime = trip.trip.estimatedTime;
    const arrivalTime = departureTime.add(estimatedTime, 'minutes');
    const [profileImage, setProfileImage] = useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);


    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        console.log(trip.createdBy)

        const getProfileImage = async () => {

            try {
                const response = await axios.get(`https://4466-197-2-98-33.ngrok-free.app/api/User/${trip.trip.userId}/profileImage`);
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
        console.log("selectedTripId")
        console.log(trip)
        setSelectedTripId(tripId)
        setShowScanner(true);
    };

    const handleBarCodeScanned = ({ type, data }) => {
        console.log("******/*/****")
        console.log(trip.tripStatus)

        setIsLoading(true);
        const parsedData = JSON.parse(data);
        const scannedtripId = parsedData.TripId;
        setTimeout(() => {
            if (scannedtripId == selectedTripId) {
                if (trip.tripStatus === 'STARTED') {
                    console.log('Trip finished');
                    setMatchedTrip(true);
                    handleMatchQrcode(trip.requestId, "Finished")
                }
                else {
                    console.log('Trip started');
                    setMatchedTrip(true);
                    handleMatchQrcode(trip.requestId, "Booked")
                }

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


    const handleMatchQrcode = async (requestRideId, status) => {
        const requestData = {
            status: status,
            deviceToken: null
        };
        try {
            const response = await axios.put(`https://4466-197-2-98-33.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchAcceptedTrips();
            return response.data;
        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };
    const handleCloseScanner = () => {
        setIsLoading(false);
        setShowScanner(false);
    };


    const Handlecanceltrip = async (requestRideId) => {
        console.log(requestRideId)
        try {
            const response = await axios.get(`https://4466-197-2-98-33.ngrok-free.app/api/RequestRide/${requestRideId}/CheckDeadlineCancel`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            try {
                if (response.status === 200) {
                    const response2 = await axios.put(`https://4466-197-2-98-33.ngrok-free.app/api/RequestRide/${requestRideId}/cancel`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    fetchAcceptedTrips();
                    return response2.data;
                }
            } catch (error) {
                console.error('Error cancelling ride request1:', error);
            }

        } catch (error) {
            if (error.response && error.response.status === 409) {
                setIsOpen(!isOpen)
                console.log('Conflict error:', error.response.data);
            } else {
                console.error('Error cancelling ride request:', error);
            }

        }
    };

    const deleteButtonReservation = async (requestRideId) => {
        console.log(requestRideId)
        try {
            const response2 = await axios.put(`https://4466-197-2-98-33.ngrok-free.app/api/RequestRide/${requestRideId}/cancel`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchAcceptedTrips();
            return response2.data;
        } catch (error) {
            console.error('Error cancelling ride request:', error);
        }
    };


    return (
        <TouchableOpacity >
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
                                        colorScheme={trip.tripStatus === 'UPCOMING' || trip.tripStatus === 'FINISHED' ? 'success' : trip.tripStatus === 'CANCELLED' ? 'red' : 'info'}

                                        alignSelf="center"
                                        variant="subtle"
                                        position="absolute"
                                        top={0}
                                        right={0}
                                    >
                                        {trip.tripStatus}
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
                                            &#x200E;  {trip.trip.source}
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
                                            &#x200E;   {trip.trip.destination}
                                        </Text>
                                    </Stack>
                                </Stack>

                                <Divider
                                    w="100%"
                                    my="2"
                                    _light={{ bg: 'muted.300' }}
                                    _dark={{ bg: 'muted.50' }}
                                />
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center">
                                        {profileImage ? (
                                            <Image
                                                source={{ uri: `data:image/jpeg;base64,${profileImage}` }}
                                                style={{ width: 50, height: 50, borderRadius: 50, marginRight: 10 }}
                                                alt="driverimg"
                                            />
                                        ) : (
                                            <UserAvatar
                                                size={40}
                                                name={trip.createdBy.firstName}
                                                bgColor="#2596be"
                                                style={{ marginRight: 10 }}
                                            />
                                        )}
                                        <Text ml="4" fontWeight="bold">
                                            {trip.createdBy && trip.createdBy.firstName} {trip.createdBy && trip.createdBy.lastName}
                                        </Text>
                                    </Stack>
                                    {trip.tripStatus === 'UPCOMING' && (
                                        <SmallCloseIcon size="5" mt="0.5" onPress={() => Handlecanceltrip(trip.requestId)}
                                        />
                                    )
                                    }
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

                                    ) : matchedTrip && trip.tripStatus === 'STARTED' ? (
                                        <>
                                            <Feather name="check-circle" size={50} color="green" />
                                            <Text>The Trip is finished .</Text>

                                        </>

                                    ) : matchedTrip  ? (
                                        <>
                                            <Feather name="check-circle" size={50} color="green" />
                                            <Text>Matching trip found! Starting the trip...</Text>

                                        </>
                                    )
                                        : (
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

            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Cancelling a Booking</AlertDialog.Header>
                    <AlertDialog.Body>
                        Your're about to cancel your booking after the deadline,
                        and will result on loosing your points.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={() => deleteButtonReservation(trip.requestId)}>
                                Confirm
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </TouchableOpacity>
    );
};

export default TripCardBooked;
