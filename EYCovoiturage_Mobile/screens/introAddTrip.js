import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity } from 'react-native';
import { Box, Icon, Stack, Center, Input } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
export default function IntroAddTrip() {
    const [selectedDates, setSelectedDates] = React.useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };


    //// modal date package
    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal = () => {
        setModalVisible2(!isModalVisible2);
    };


    return (
        <View style={styles.container}>
            <Box safeArea p="2" w="90%" maxW="290" py="8" h="100%">
                <Stack space={4} w="100%" alignItems="flex-start">
                    <Input
                        w="100%"
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

                    <TouchableOpacity
                        style={[styles.button, { width: "100%" }]}
                        onPress={handleSelectDates}
                    >
                        <Text style={styles.textStyle}>Select Dates</Text>
                    </TouchableOpacity>

                    <Modal isVisible={modalVisible} backdropColor={"black"} backdropOpacity={0.70} animationType="slide">

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



                    <Input variant="underlined" w="100%" placeholder="Time" />
                    <Button title="Show Date Picker" onPress={showDatePicker} />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="time"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />

                    <View style={{ flex: 1 }}>
                        <Button title="Open Modal" onPress={toggleModal} />

                        <Modal coverScreen={true} isVisible={isModalVisible2} onBackdropPress={toggleModal} >
                            <View style={styles.modal}>
                                <Text>This is the modal content.</Text>
                                <Button title="Close Modal" onPress={toggleModal} />
                            </View>
                        </Modal>
                    </View>


                </Stack>



            </Box>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        alignItems: "center",
        backgroundColor: "#2c2c3b",
        padding: 10,
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
        // justifyContent: 'center',
        //  alignItems: 'center',
        // backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
});