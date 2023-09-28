import React from "react";
import { Box, Divider, Button, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, View, Modal, FormControl, Input, Badge } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TripCardWithQRcode = ({ onPress, trip }) => {
    const [imageSource, setImageSource] = useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [showModalEditTrip, setShowModalEditTrip] = React.useState(false);
    const [modalDate, setModalDate] = useState(false);
    const [formData, setFormData] = React.useState({
        source: '',
        destination: '',
        availableSeats: '',
        departureTime: '',
        tripId: ''
    });

    const [selectedDates, setSelectedDates] = useState(() => {
        const initialSelectedDates = {};
        trip.availableDates.forEach((dateObj) => {
            initialSelectedDates[moment(dateObj.date).format("YYYY-MM-DD")] = { selected: true };
        });
        return initialSelectedDates;
    });
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(moment(trip.departureTime, 'HH:mm:ss').toDate());


    React.useEffect(() => {
        const { source, destination, availableSeats, departureTime, availableDates, tripId } = trip;
        setFormData({
            source,
            destination,
            availableSeats,
            departureTime,
            tripId
        });

    }, []);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const combinedTrip = {
        ...formData,
        availableDates: Object.keys(selectedDates).map((date) => {
            return {
                date: date
            }
        })

    };

    const handleSubmitEdit = async () => {
        console.log("combinedTrip")
        console.log(combinedTrip)
        try {
            const response = await axios.put(`https://da8a-102-157-148-107.ngrok-free.app/api/Trip/${combinedTrip.tripId}`, combinedTrip, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data)
            setShowModalEditTrip(false)
            return response.data;
        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };


    const handleQRCodeIconPress = async (tripId) => {
        try {
            fetch(`https://da8a-102-157-148-107.ngrok-free.app/api/RequestRide/generate?driverId=1&tripId=${tripId}`)
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

    const handleConfirm = (date) => {
        setSelectedTime(date);
        const formattedTime = moment(date).format('HH:mm:ss');
        setFormData((prevFormData) => ({
            ...prevFormData,
            departureTime: formattedTime,
        }));
        hideDatePicker();
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDelete = async (tripId) => {
        axios
            .delete(`https://da8a-102-157-148-107.ngrok-free.app/api/Trip/${tripId}`)
            .then((response) => {
                console.log('Trip deleted successfully.');
            })
            .catch((error) => {
                console.error('Error deleting trip:', error);
            });
    };

    return (
        <TouchableOpacity >
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
                                <Stack direction="row" space={1} alignItems="center" ml="1" justifyContent="flex-end">
                                    <AntDesign name="delete" size={20} color="black" onPress={() => handleDelete(trip.tripId)} />
                                    <Feather name="edit" size={20} color="black" onPress={() => setShowModalEditTrip(true)} />
                                    <MaterialCommunityIcons name="qrcode-plus" size={20} color="black" onPress={() => handleQRCodeIconPress(trip.tripId)} />
                                </Stack>

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
                                            >
                                                {new Date(dateObj.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}
                                            </Text>
                                        ))}
                                    </Stack>
                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <Ionicons name="md-time-outline" size={24} color="black" />
                                    <Text fontSize="xs" >
                                        Departure time: {trip.departureTime.split(':').slice(0, 2).join(':')}
                                    </Text>

                                </Stack>

                                <Stack direction="row" space={4} alignItems="center" ml="1">
                                    <MaterialCommunityIcons name="seat-passenger" size={24} color="black" />
                                    <Text fontSize="xs" >
                                        {trip.availableSeats} Seats
                                    </Text>
                                </Stack>

                            </Stack>
                            {/*  <Box position="absolute" top="2" right="2">
                                <MaterialCommunityIcons name="qrcode-plus" size={24} color="black" />
                            </Box> */}

                        </Box>
                    </Box>
                </Box>
            </Box>

            <Modal isOpen={showModalEditTrip} onClose={() => setShowModalEditTrip(false)} size={"full"}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Trip informations</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>source</FormControl.Label>
                            <Input value={formData.source}
                                onChangeText={(value) => handleChange('source', value)} />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>destination</FormControl.Label>
                            <Input value={formData.destination}
                                onChangeText={(value) => handleChange('destination', value)} />
                        </FormControl>


                        <FormControl>
                            <FormControl.Label>availableSeats</FormControl.Label>
                            <Input value={trip.availableSeats.toString()}
                                onChangeText={(value) => handleChange('availableSeats', value)} />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>departureTime</FormControl.Label>
                            <Input
                                value={moment(selectedTime).format('HH:mm')}
                                onTouchStart={() => setDatePickerVisible(true)}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="time"
                                date={selectedTime}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                is24Hour={true}
                            />
                        </FormControl>

                        <HStack space={1} padding={1} mt={2}>
                            <TouchableOpacity onPress={() => setModalDate(true)} >
                                <AntDesign name="calendar" size={24} color="black" />
                            </TouchableOpacity>

                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                                {Object.keys(selectedDates).map((date) => (
                                    <Badge key={date} colorScheme="lightBlue" mx={1} my={1} variant={'subtle'}>
                                        <Text>{date}</Text>
                                    </Badge>
                                ))}
                            </View>

                        </HStack>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModalEditTrip(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={handleSubmitEdit}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Modal isOpen={modalDate} backdropColor={"black"} backdropOpacity={0.70} animationType="slide">
                <View style={styles.modal} >
                    <Calendar
                        style={{ elevation: 4 }}
                        markedDates={selectedDates}
                        markingType={"multi-dot"}
                        onDayPress={(day) => {
                            const selectedDay = day.dateString;
                            const newDates = { ...selectedDates };
                            if (newDates[selectedDay]) {
                                delete newDates[selectedDay];
                            } else {
                                newDates[selectedDay] = { selected: true };
                            }
                            setSelectedDates(newDates);
                            console.log(selectedDates);
                        }}

                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}>
                        <TouchableOpacity style={styles.dateButtons} onPress={() => setModalDate(false)}>
                            <Text style={styles.textStyle2}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateButtons} onPress={() => setModalDate(false)} >
                            <Text style={styles.textStyle2} >Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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

const styles = StyleSheet.create({

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
