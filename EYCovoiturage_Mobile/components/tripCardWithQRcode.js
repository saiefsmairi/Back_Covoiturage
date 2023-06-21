import React from "react";
import { Box, Divider, Button, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, View, Modal } from "native-base";
import { TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useEffect } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";


const TripCardWithQRcode = ({ onPress, trip }) => {
    const [imageSource, setImageSource] = useState(null);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
    }, []);

    const handleQRCodeIconPress = async (tripId) => {
        try {
            fetch(`https://4183-145-62-80-62.ngrok-free.app/api/RequestRide/generate?driverId=1&tripId=${tripId}`)
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    throw new Error('Error retrieving QR code');
                })
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Image = reader.result;
                        setImageSource(base64Image);
                        setShowModal(true); // Show the modal when the image is loaded
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.error('Error generating QR code:', error);
                });
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    return (
        <TouchableOpacity onPress={() => handleQRCodeIconPress(trip.tripId)}>
            <Box>
                <Box mx="7" my="2" >
                    <Box
                        my="1"
                        rounded="lg"
                        overflow="hidden"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        _dark={{
                            borderColor: "coolGray.600",
                            backgroundColor: "gray.700",
                        }}
                        _web={{
                            shadow: 2,
                            borderWidth: 0,
                        }}
                        _light={{
                            backgroundColor: "gray.50",
                        }}
                    >
                        <Box position="relative">
                            <Stack space={1} padding={1}>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <MaterialCommunityIcons name="map-marker-radius" size={24} color="black" />
                                    <Text fontSize="xs" fontWeight="500">
                                        {trip.source}
                                    </Text>
                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color="black" />
                                    <Text fontSize="xs" fontWeight="500">
                                        {trip.destination}
                                    </Text>
                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <AntDesign name="calendar" size={24} color="black" />
                                    <Text fontSize="xs" >
                                        {new Date(trip.dateDebut).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}
                                        {' to '}
                                        {new Date(trip.dateFin).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}
                                    </Text>
                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <Ionicons name="md-time-outline" size={24} color="black" />
                                    <Text fontSize="xs" >
                                        Departure time: {trip.departureTime}
                                    </Text>
                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <MaterialCommunityIcons name="seat-passenger" size={24} color="black" />
                                    <Text fontSize="xs" >
                                        {trip.availableSeats} Seats
                                    </Text>
                                </Stack>

                            </Stack>
                            <Box position="absolute" top="2" right="2">
                                <MaterialCommunityIcons name="qrcode-plus" size={24} color="black" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="full">
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Scan the QRCode</Modal.Header>
                    <Modal.Body flex={1}
                        justifyContent="center"
                        alignItems="center">
                        {imageSource && (
                            <Image
                                source={{ uri: imageSource }}
                                style={{ width: 300, height: 300 }}
                                alt="QR Code"
                            />
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => setShowModal(false)}>Save</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </TouchableOpacity>
    );
};

export default TripCardWithQRcode;
