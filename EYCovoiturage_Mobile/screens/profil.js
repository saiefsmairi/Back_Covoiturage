import React, { useState } from "react";
import { Avatar, Box, Divider, Stack, Spinner, CheckIcon } from "native-base";
import { Button, Modal, FormControl, Input, Center, NativeBaseProvider } from "native-base";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from 'react-native-user-avatar';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';



export default function Profil({ navigation }) {
    const [showModal, setShowModal] = React.useState(false);
    const [showModalVerfiyPhone, setShowModalVerfiyPhone] = React.useState(false);

    const [showModalCar, setShowModalCar] = React.useState(false);

    const [profileImage, setProfileImage] = useState('');
    const [carImage, setcarImage] = useState('');
    const [user, setUser] = useState(null);
    const [userStorage, setUserStorage] = useState('');
    const [selectedCarbrand, setSelectedCarbrand] = useState("");
    const [loadingUser, setLoadingUser] = React.useState(false);
    const [loadingCar, setLoadingcar] = React.useState(false);
    const [TotalPoints, setTotalPoints] = React.useState('');

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
                const value = await SecureStore.getItemAsync('user');
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
                const value = await SecureStore.getItemAsync('user');
                var userId = JSON.parse(value).id
                console.log(userId)
                const response = await axios.get(`https://da8a-102-157-148-107.ngrok-free.app/api/User/${userId}`);

                console.log(response.data)
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
            const value = await SecureStore.getItemAsync('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://da8a-102-157-148-107.ngrok-free.app/api/User/${userId}/profileImage`);
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
        getUserById();
        getProfileImage();

    }, [profileImage]);


    useFocusEffect(
        React.useCallback(() => {

            const getUserById = async (userId) => {
                setLoadingUser(true);
                try {
                    const value = await SecureStore.getItemAsync('user');
                    var userId = JSON.parse(value).id
                    const response = await axios.get(`https://da8a-102-157-148-107.ngrok-free.app/api/User/${userId}`);
                    console.log(response.data)
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
            getUserById();

        }, [])

    );


    React.useEffect(() => {
        const getCarInfo = async (userId) => {
            setLoadingcar(true);

            const value = await SecureStore.getItemAsync('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://da8a-102-157-148-107.ngrok-free.app/api/User/${userId}/carImage`);
                const base64Image = response.data.base64Image;
                setSelectedCarbrand(response.data.carBrand)
                setcarImage(base64Image)
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User does not have a car image');
                } else {
                    console.log('Error retrieving car image:', error);
                }
            }
            setLoadingcar(false);

        };
        getCarInfo();

        const getTotalpoints = async (userId) => {
            const value = await SecureStore.getItemAsync('user');
            var userId = JSON.parse(value).id
            try {
                const response = await axios.get(`https://da8a-102-157-148-107.ngrok-free.app/api/User/users/${userId}/TotalPoints`);
                setTotalPoints(response.data)
            } catch (error) {
                console.log('Error retrieving total user points:', error);
            }
        };
        getTotalpoints();
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

                const value = await SecureStore.getItemAsync('user');
                var userId = JSON.parse(value).id

                const response = await axios.put(
                    `https://da8a-102-157-148-107.ngrok-free.app/api/User/${userId}/upload`,
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
            const response = await axios.put(`https://da8a-102-157-148-107.ngrok-free.app/api/User/${userStorage.id}`, formData);
            const updatedUser = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUserStorage(updatedUser);
            setShowModal(false); // Close the modal after submitting the form
        } catch (error) {
            console.log('Error updating user:', error);
        }
        setShowModal(false);
    };

    const [verificationCode, setVerificationCode] = useState('');

    const generateVerificationCode = () => {
        // Generate a random 4-digit code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        return code;
    };


    const handleSendVerifCode = async () => {
/*         navigation.navigate('phoneNumberVerification', {
            VerifCode: 2002
        }); */
        setShowModalVerfiyPhone(false);
            try {
             const phoneNumber = '+21629162035'; 
             const code = generateVerificationCode(); 
         
             const response = await axios.post('https://da8a-102-157-148-107.ngrok-free.app/api/User/sendSMSForConfirmPhone', null, {
               params: {
                 phoneNumber: phoneNumber,
                 message: code
               }
             });
             console.log(response.data);
   
             const codeStartIndex = response.data.lastIndexOf('-') + 1;
             const verificationCode = response.data.substring(codeStartIndex).trim();
                setShowModalVerfiyPhone(false);
            // setVerificationCode(code);
             navigation.navigate('phoneNumberVerification', {
               VerifCode:verificationCode
           });
           } catch (error) {
             console.error('Failed to send SMS:', error);
           } 
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

                <Stack space={2} direction="column" style={styles.container1} >
                    <View style={styles.imageContainer}>
                        {loadingUser || !user ? (
                            <Spinner color="red.500" />
                        ) : (
                            !user.image ? (
                                <UserAvatar size={100} name={userStorage.firstName} bgColor="#2596be" />
                            ) : (
                                profileImage ? (
                                    <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={styles.userImage} />
                                ) : (
                                    <Spinner color="red.500" />

                                )
                            )
                        )}
                    </View>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username}> {userStorage && userStorage.firstName ? userStorage.firstName : ''} {''}
                            {userStorage && userStorage.lastName ? userStorage.lastName : ''}</Text>
                    </View>
                    <Stack space={4} direction="row" alignItems="center" >
                        <Image source={require('../assets/reward2.gif')} style={{ width: 50, height: 50 }} />
                        <Stack direction="column" >
                            <Text style={styles.pointsText}>
                                {user?.points} Points
                            </Text>
                            <Text style={styles.rewardText}>
                                My reward points
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>


                <Stack space={4}  >
                    <TouchableOpacity onPress={handleProfilePhotoSelect}>
                        <Text style={styles.textStyle}>
                            Update your profil image
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Text style={styles.textStyle} >
                            Update your profil informations
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

                    {user && (
                        <Stack direction="row" space={2}>
                            {user.isVerifiedPhoneNumber ? (
                                <>
                                    <AntDesign name="phone" size={24} color="#2596be" />
                                    <Text style={styles.textStyle}>Your phone number is verified</Text>
                                    <CheckIcon size="5" mt="0.5" color="emerald.500" />
                                </>
                            ) : (
                                <>
                                    <AntDesign name="phone" size={24} color="#2596be" />
                                    <TouchableOpacity onPress={() => setShowModalVerfiyPhone(true)}>
                                        <Text style={styles.textStyle}>Verify your phone number</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Stack>
                    )}


                    <Modal isOpen={showModalVerfiyPhone} onClose={() => setShowModalVerfiyPhone(false)} size={"full"}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Phone number verification</Modal.Header>
                            <Modal.Body>
                                <FormControl>
                                    <FormControl.Label>Phone number</FormControl.Label>
                                    <Input value={formData.phone}
                                    />
                                </FormControl>
                                <Button space={2} style={{ marginTop: 10, borderRadius: 20, width: "70%", alignSelf: "center" }} onPress={handleSendVerifCode}>
                                    Send Verification code
                                </Button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                        setShowModalVerfiyPhone(false);
                                    }}>
                                        Cancel
                                    </Button>

                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>




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
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 100 }}>
                            <Text>{selectedCarbrand}</Text>
                            {loadingCar ? (
                                <Spinner color="red.500" />
                            ) : carImage && selectedCarbrand ? (

                                <Stack direction="row" alignItems="center">
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${carImage}` }}
                                        style={{ width: '70%', height: 100, marginLeft: 10 }}
                                    />
                                    <Stack direction="row" alignItems="center">
                                        <TouchableOpacity onPress={displayCarInfoComponent}>
                                            <AntDesign name="edit" size={24} color="#2596be" />

                                        </TouchableOpacity>
                                    </Stack>
                                </Stack>

                            ) : (
                                <TouchableOpacity onPress={displayCarInfoComponent}>
                                    <Text style={styles.textStyle}>Add Vehicle</Text>
                                </TouchableOpacity>
                            )}
                        </View>
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
    rewardText: {
        color: "grey",
        fontSize: 12
    },
    pointsText: {
        color: "#2c2c3b",
        fontWeight: 'bold',
        fontSize: 15
    },
    TitleStyle: {
        color: "#2c2c3b",
        fontWeight: 500,
        fontSize: 20
    },
    container1: {
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        padding: 10,
        alignItems: 'center',
    },
    imageContainer: {
        position: 'absolute',
        top: -50, // Adjust this value as per your requirement
        backgroundColor: 'transparent',

    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
    },
    usernameContainer: {
        marginTop: 30, // Adjust this value as per your requirement
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});