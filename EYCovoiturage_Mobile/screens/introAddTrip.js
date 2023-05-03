import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity, Modal } from 'react-native';
import { Box, Icon, Stack, Center, Input } from "native-base";

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
export default function IntroAddTrip() {
    const [selectedDates, setSelectedDates] = React.useState({});
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelectDates = () => {
        setModalVisible(true);
    }

    const handleConfirmDates = () => {
        setModalVisible(false);
        console.log(selectedDates);
    }

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

                    <Modal visible={modalVisible} animationType="slide">
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                <Button title="Confirm" onPress={handleConfirmDates} />
                            </View>
                            <Calendar
                                style={{ borderRadius: 10, elevation: 4, margin: 40 }}
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
                        </View>
                    </Modal>
                    <Input variant="underlined" w="100%" placeholder="Time" />
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
    textStyle: {
        color: "yellow",
        fontWeight: 500
    }
});