import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity, HStack, YellowBox, LogBox } from 'react-native';
import { Box, Icon, Stack, Center, Input, FormControl } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';
import { Badge } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function IntroAddTrip({ navigation, route }) {
    const [selectedDates, setSelectedDates] = React.useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        // Disable the specific warning
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
      }, []);

    useEffect(() => {

        async function getLocationAsync() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        const selectedPlace = route.params?.selectedPickupPlace;
        console.log(selectedPlace)
        getLocationAsync();
    }, [route.params]);


    const handleSelectDates = () => {
        setModalVisible(true);
    }

    const handleConfirmDates = () => {
        setModalVisible(false);
        console.log(selectedDates);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' , hour12: false});

        console.log(time)
        setSelectedTime(time);
        hideDatePicker();
    };


    const [seatsSelected, setSeatsSelected] = useState(1);

    const handleSeatSelection = (action) => {
        if (action === 'add' && seatsSelected < 4) {
            setSeatsSelected(seatsSelected + 1);
        }
        else if (action === 'subtract' && seatsSelected > 1) {
            setSeatsSelected(seatsSelected - 1);
        }

    };


    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);
    const [pickupLocationCords, setPickupLocationCords] = useState([]);
    const [dropLocationCords, setDropLocationCords] = useState([]);

    const displayMapsComponent = () => {
        navigation.navigate('pickupMap', {
            onReturn: (item) => {
                console.log("***/*/*/*/*/*/")
                console.log(item.properties.address_line1)
                setPickupLocation(item.properties.address_line1)
                setPickupLocationCords(item.geometry.coordinates)
            }
        })
    };


    const displayMapsComponentDrop = () => {
        navigation.navigate('dropMap', {
            onReturn: (item) => {
                console.log("***/*/*/*/*/*/")
                console.log(item.properties.address_line1)
                setDropLocation(item.properties.address_line1)
                setDropLocationCords(item.geometry.coordinates)
            }
        })
    };

    const handlePressRouteComponent = () => {
        navigation.navigate('routeDetails', {
            pickupLocationCords: pickupLocationCords,
            dropLocationCords: dropLocationCords,
            selectedDates: selectedDates,
            dropLocation: dropLocation,
            pickupLocation: pickupLocation,
            seatsSelected: seatsSelected,
            selectedTime:selectedTime
        });
    };
    const today = new Date(); // Get the current date
    const minDate = today.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
  
    return (
        <ScrollView style={{backgroundColor:'white'}}>

            <View style={styles.container}>

                <Box safeArea p="2" maxW="290" h="100%">
                    <Stack space={4} w="100%" alignItems="center">
                        <Input
                            w="100%"
                            value={pickupLocation}
                            onTouchStart={displayMapsComponent}
                            InputLeftElement={
                                <Icon
                                    as={<FontAwesome name="map-marker" size={24} color="black" />}
                                    size={5}
                                    ml="2"
                                    color="muted.400"
                                />
                            }
                            placeholder="Enter pickup location"
                        />

                        <Input
                            w="100%"
                            value={dropLocation}
                            onTouchStart={displayMapsComponentDrop}
                            InputLeftElement={
                                <Icon
                                    as={<FontAwesome name="map-marker" size={24} color="black" />}
                                    size={5}
                                    ml="2"
                                    color="muted.400"
                                />
                            }
                            placeholder="Enter drop location"
                        />
                        <View >
                            <FormControl.Label>Time of departure</FormControl.Label>

                            <Input variant="underlined" w="100%" placeholder="Time" onTouchStart={showDatePicker} value={selectedTime} />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="time"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                is24Hour={true} 
                            />
                        </View>
                        <View style={{ alignItems: "center" }} >
                            <FormControl.Label>Date of departure</FormControl.Label>

                            <TouchableOpacity onPress={handleSelectDates}>
                                <AntDesign name="calendar" size={24} color="black" />
                            </TouchableOpacity>

                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                                {Object.keys(selectedDates).map((date) => (
                                    <Badge key={date} colorScheme="lightBlue" mx={1} my={1} variant={'subtle'}>
                                        <Text>{date}</Text>
                                    </Badge>
                                ))}
                            </View>
                        </View>

                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <FormControl.Label>Select number of seats</FormControl.Label>
                            <View style={styles.selectionContainer}>
                                <TouchableOpacity onPress={() => handleSeatSelection('subtract')}>
                                    <AntDesign style={styles.buttonText} name="minuscircleo" size={20} color="#11b3f4" />
                                </TouchableOpacity>
                                <Text style={styles.seatsSelected}>{seatsSelected}</Text>
                                <TouchableOpacity onPress={() => handleSeatSelection('add')}>
                                    <AntDesign style={styles.buttonText} name="pluscircleo" size={20} color="#11b3f4" />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <Modal isVisible={modalVisible} backdropColor={"black"} backdropOpacity={0.70} animationType="slide">
                            <View style={styles.modal} >
                                <Calendar
                                    style={{ elevation: 4 }}
                                    markedDates={selectedDates}
                                    markingType={"multi-dot"}
                                    minDate={minDate}
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
                                    renderArrow={(direction) =>
                                        direction === "left" ? (
                                            <Ionicons name="ios-arrow-back" size={30} color="gray" />
                                        ) : (
                                            <Ionicons name="ios-arrow-forward" size={30} color="gray" />
                                        )
                                    }
                                />
                                <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}>
                                    <TouchableOpacity style={styles.dateButtons} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dateButtons} onPress={handleConfirmDates}>
                                        <Text style={styles.textStyle}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <Stack space={3}  >
                            <TouchableOpacity style={styles.button} onPress={handlePressRouteComponent}>
                                <Text style={styles.textStyle}>Next</Text>
                            </TouchableOpacity>
                        </Stack>

                    </Stack>

                </Box>

            </View>
        </ScrollView>
    );

}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white', // Set the background color to white

    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
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
    modal: {

        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2596be'
    },
    selectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {

        paddingHorizontal: 10,
    },
    seatsSelected: {
        fontSize: 30,

        marginHorizontal: 20,
        //color:'#11b3f4'
    },
});