import React from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Input, Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider } from "native-base";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

export default function SearchTrips({ navigation }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedDates, setSelectedDates] = React.useState({});

    const handlePress = ({ }) => {
        console.log("pressed button")
        navigation.navigate('rideDetails');
    };
    const handleConfirmDates = () => {
        setModalVisible(false);
        console.log(selectedDates);
    }

    const handleSelectDates = () => {
        setModalVisible(true);
    }

    return (
        <ScrollView>

            <Box >
                <Stack mx="7" marginTop={20}  onPress={handlePress}>
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
                        <Box>
                            <Stack  space={2} >
                            <Stack  >
                            <Image
                                source={{ uri: 'https://img.freepik.com/free-vector/businesswoman-with-heart-likes-using-autonomos-car-with-technology-icons-autonomous-car-self-driving-car-driverless-robotic-vehicle-concept-bright-vibrant-violet-isolated-illustration_335657-916.jpg?w=1060&t=st=1683708711~exp=1683709311~hmac=893a613cdf4dd12ac1a68e69d2bab94e1c3adfed7d2a8ab37073c8c5ffbae320' }}
                                style={{ width: '100%', height: 200 }}
                                alt='car'
                            />
                        </Stack>
                                <Stack space={2} >
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
                                </Stack>
                                <Divider
                                    w="100%"
                                    my="2"
                                    _light={{ bg: "muted.300" }}
                                    _dark={{ bg: "muted.50" }}
                                />
                                <Stack direction="row" alignItems="center">
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
                                </Stack>
                                <Divider
                                    w="100%"
                                    my="2"
                                    _light={{ bg: "muted.300" }}
                                    _dark={{ bg: "muted.50" }}
                                />
                                <Stack direction="row" alignItems="center" marginLeft={20}>
                                    <TouchableOpacity onPress={handleSelectDates}>
                                        <AntDesign name="calendar" size={24} color="black" />
                                    </TouchableOpacity>

                                    <Divider orientation="vertical" mx="3"
                                        _light={{ bg: "muted.300" }}
                                        _dark={{ bg: "muted.50" }} />

                                    <Input
                                        variant="unstyled"
                                        InputLeftElement={
                                            <Icon
                                                as={<Ionicons name="person" size={24} color="black" />}
                                                size={5}
                                                ml="2"
                                                color="muted.400"
                                            />
                                        }
                                        placeholder=""
                                    />
                                </Stack>

                                <Stack >
                                    <TouchableOpacity style={styles.button} onPress={handlePress}>
                                        <Text style={styles.textStyle}>Search</Text>
                                    </TouchableOpacity>
                                </Stack>

                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </Box>

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
        </ScrollView>


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