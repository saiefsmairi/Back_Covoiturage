import React, { useState } from "react";
import { Avatar, Box, Divider, Stack, Spinner } from "native-base";
import { Button, Modal, FormControl, Input, Center, NativeBaseProvider } from "native-base";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profil({ navigation }) {
    const [showModal, setShowModal] = React.useState(false);
    const [showModalCar, setShowModalCar] = React.useState(false);

    const [profileImage, setProfileImage] = useState('');
    const [carImage, setcarImage] = useState('');
    const [user, setUser] = useState(null);
    const [userStorage, setUserStorage] = useState('');
    const [selectedCarbrand, setSelectedCarbrand] = useState("");

    const [loadingUser, setLoadingUser] = React.useState(false);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        phone: '',
        adress: '',
        email: '',
    });

    React.useEffect(() => {
        const getData = async (key) => {
            try {
                const value = await AsyncStorage.getItem('user');
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

        const getUserById = async (userId) => {
            setLoadingUser(true);
            try {
                const value = await AsyncStorage.getItem('user');
                var userId = JSON.parse(value).id
                const response = await axios.get(`https://1318-102-159-105-67.ngrok-free.app/api/User/${userId}`);
                setUser(response.data)
                const { firstName, lastName, email, phone, adress } = response.data;
                setFormData({
                    firstName,
                    lastName,
                    email,
                    phone,
                    adress,
                });
            } catch (error) {
                console.log('Error fetching user:', error);
            }
            setLoadingUser(false);

        };

        const getProfileImage = async (userId) => {
            const value = await AsyncStorage.getItem('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://1318-102-159-105-67.ngrok-free.app/api/User/${userId}/profileImage`);
                const base64Image = response.data;
                setProfileImage(base64Image);
            } catch (error) {
                console.log('Error retrieving profile image:', error);
            }
        };
        getUserById();
        getProfileImage();

    }, [profileImage]);


    React.useEffect(() => {
        const getCarInfo = async (userId) => {
            const value = await AsyncStorage.getItem('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://1318-102-159-105-67.ngrok-free.app/api/User/${userId}/carImage`);
                const base64Image = response.data.base64Image;
                setSelectedCarbrand(response.data.carBrand)
                setcarImage(base64Image)
            } catch (error) {
                console.log('Error retrieving car image:', error);
            }
        };
        getCarInfo(); // Fetch car image separately
    }, []);



    const handleProfilePhotoSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true
        });
        if (!result.canceled) {
            try {
                const formData = new FormData();
                formData.append('profilePhoto', {
                    uri: result.assets[0].uri,
                    name: 'profile_photo.jpg',
                    type: 'image/jpeg',
                });

                const value = await AsyncStorage.getItem('user');
                var userId = JSON.parse(value).id

                const response = await axios.put(
                    `https://1318-102-159-105-67.ngrok-free.app/api/User/${userId}/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                //lvaleur eli west set profileimg doesnt make any diff we just do set so it calls the function in the useEffect
                setProfileImage(result.assets[0].uri);

                console.log('Profile photo uploaded successfully:', response.data);
            } catch (error) {
                console.log('Error uploading profile photo:', error);
            }
        }
        else {
            alert('You did not select any image.');
        }
    };

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`https://1318-102-159-105-67.ngrok-free.app/api/User/${userStorage.id}`, formData);
            const updatedUser = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUserStorage(updatedUser);
            setShowModal(false); // Close the modal after submitting the form
        } catch (error) {
            console.log('Error updating user:', error);
        }
        setShowModal(false);
    };


    //car add
    const displayCarInfoComponent = () => {
        navigation.navigate('addCarInfo')
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
                                <FormControl.Label>Adress</FormControl.Label>
                                <Input value={formData.adress}
                                    onChangeText={(value) => handleChange('adress', value)} />
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
                        {userStorage && userStorage.firstName ? userStorage.firstName : ''} {''}
                        {userStorage && userStorage.lastName ? userStorage.lastName : ''}
                    </Text>

                    {loadingUser || !user ? (
                        <Spinner color="red.500" />
                    ) : (
                        !user.image ? (
                            <Avatar bg="cyan.500" size="2xl">
                                RS
                            </Avatar>
                        ) : (
                            profileImage ? (
                                <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            ) : (
                                <Spinner color="red.500" />

                            )
                        )
                    )}
                </Stack>
                <Stack space={4}>
                    <TouchableOpacity onPress={handleProfilePhotoSelect}>
                        <Text style={styles.textStyle}>
                            Modifier la photo de profil
                        </Text>
                    </TouchableOpacity>

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

                    <Stack direction="row" space={5}>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Text>{selectedCarbrand}</Text>
                            {carImage ? (
                                <Image source={{ uri: `data:image/jpeg;base64,${carImage}` }} style={{ width: 50, height: 50,marginLeft:10 }} />
                            ) : (
                                <Spinner color="red.500" />
                            )}
                        </View>
                    </Stack>


                    {carImage || selectedCarbrand ? (
                        <Stack direction="row" space={2}>
                            <AntDesign name="edit" size={24} color="#2596be" />
                            <TouchableOpacity onPress={displayCarInfoComponent}>
                                <Text style={styles.textStyle}>Update Vehicule</Text>
                            </TouchableOpacity>
                        </Stack>
                    ) : (
                        <Stack direction="row" space={2}>
                            <AntDesign name="pluscircleo" size={24} color="#2596be" />
                            <TouchableOpacity onPress={displayCarInfoComponent}>
                                <Text style={styles.textStyle}>Add Vehicule</Text>
                            </TouchableOpacity>
                        </Stack>
                    )}

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