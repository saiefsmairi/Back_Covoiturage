import React from "react";
import { Avatar, Box, Divider, Stack } from "native-base";
import { Button, Modal, FormControl, Input, Center, NativeBaseProvider } from "native-base";

import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function Profil({ navigation }) {
    const [showModal, setShowModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        email: '',
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        console.log(formData);
        setShowModal(false);
    };
    return (
        <ScrollView>
            <Stack direction="column" my={2} mx={4} space={4} >
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"full"}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>User informations</Modal.Header>
                        <Modal.Body>
                            <FormControl>
                                <FormControl.Label>First name</FormControl.Label>
                                <Input value={formData.firstName}
                                    onChangeText={(value) => handleChange('firstName', value)} />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Last name</FormControl.Label>
                                <Input value={formData.lastName}
                                    onChangeText={(value) => handleChange('lastName', value)} />
                            </FormControl>


                            <FormControl>
                                <FormControl.Label>Email</FormControl.Label>
                                <Input value={formData.email}
                                    onChangeText={(value) => handleChange('email', value)} />
                            </FormControl>


                            <FormControl>
                                <FormControl.Label>Phone</FormControl.Label>
                                <Input value={formData.phone}
                                    onChangeText={(value) => handleChange('phone', value)} />
                            </FormControl>


                            <FormControl>
                                <FormControl.Label>Address</FormControl.Label>
                                <Input value={formData.address}
                                    onChangeText={(value) => handleChange('address', value)} />
                            </FormControl>





                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button onPress={handleSubmit}>
                                    Save
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Stack direction="row" alignItems="center" space={2} justifyContent="space-between">
                    <Text
                        fontSize="3xl"
                        fontWeight="500"
                        style={[{ flexShrink: 1 }, styles.TitleStyle]}
                    >
                         Johnson Alice 
                    </Text>
                    <Avatar
                        bg="green.500"
                        style={{ width: 100, height: 100 }}
                        source={{
                            uri:
                                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                        }}
                    >
                        AJ
                    </Avatar>
                </Stack>
                <Stack space={4}>
                    <Text style={styles.textStyle}>
                        Modifier la photo de profil
                    </Text>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Text style={styles.textStyle} >
                            Modifier les informations personnelles
                        </Text>
                    </TouchableOpacity>
                </Stack>
                <Divider
                    w="100%"
                    alignSelf={'center'}
                    _light={{ bg: "muted.300" }}
                    _dark={{ bg: "muted.50" }}
                />
                <Stack space={4}>
                    <Text fontWeight="bold" style={styles.TitleStyle} >
                        Verify your profil
                    </Text>
                    <Stack direction="row" space={2}   >
                        <AntDesign name="pluscircleo" size={24} color="#2596be" />
                        <Text style={styles.textStyle}>
                            Confirm Email Adress
                        </Text>
                    </Stack>
                    <Stack direction="row" space={2}   >
                        <AntDesign name="pluscircleo" size={24} color="#2596be" />
                        <Text style={styles.textStyle}>
                            Verify your phone number
                        </Text>
                    </Stack>
                </Stack>
                <Divider
                    w="100%"
                    alignSelf={'center'}
                    _light={{ bg: "muted.300" }}
                    _dark={{ bg: "muted.50" }}
                />

                <Stack space={4}>
                    <Text fontWeight="bold" style={styles.TitleStyle}>
                        About you
                    </Text>
                    <Stack direction="row" space={2}   >
                        <AntDesign name="pluscircleo" size={24} color="#2596be" />
                        <Text style={styles.textStyle}>
                            Add bio
                        </Text>
                    </Stack>
                    <Stack direction="row" space={2}   >
                        <AntDesign name="pluscircleo" size={24} color="#2596be" />
                        <Text style={styles.textStyle}>
                            Add préférences
                        </Text>
                    </Stack>
                </Stack>

                <Divider
                    w="100%"
                    alignSelf={'center'}
                    _light={{ bg: "muted.300" }}
                    _dark={{ bg: "muted.50" }}
                />

                <Stack space={4}>
                    <Text fontWeight="bold" style={styles.TitleStyle}>
                        Vehicule
                    </Text>

                    <Stack direction="row" space={2}   >
                        <AntDesign name="pluscircleo" size={24} color="#2596be" />
                        <Text style={styles.textStyle} >
                            Add new vehicule
                        </Text>
                    </Stack>
                </Stack>
            </Stack>

        </ScrollView>


    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#2c2c3b",
        padding: 10,
    },
    textStyle: {
        color: "#2596be",


    },
    TitleStyle: {
        color: "#2c2c3b",
        fontWeight: 500,
        fontSize: 20
    },
});