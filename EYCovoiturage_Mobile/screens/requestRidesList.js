import React, { useState, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollViewProps, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from "axios";
import { NativeBaseProvider, Box, Pressable, Heading, IconButton, Icon, HStack, Avatar, VStack, Spacer, Center, ScrollView } from 'native-base';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import HomeSvg from "../components/homesvg";
import Orderride from "../components/orderridesvg";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RequestRidesList({ }) {
    const [isLoading, setIsLoading] = useState(false);
    const [requestRide, setRequestRide] = useState([]);
    const [profileImage, setProfileImage] = useState('');
    const [isHiddenItemVisible, setIsHiddenItemVisible] = useState(true); // State variable for hidden item visibility

    const fetchRideRequests = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            var userId = JSON.parse(value).id;
            const response = await axios.get(`https://6e65-197-2-231-204.ngrok-free.app/api/RequestRide/requests/${userId}`);
            const requestRidesWithProfileImage = [];

            for (const requestRide of response.data) {
                const { passengerId } = requestRide;

                try {
                    const imageResponse = await axios.get(`https://6e65-197-2-231-204.ngrok-free.app/api/User/${passengerId}/profileImage`);
                    const base64Image = imageResponse.data;
                    requestRide.passenger.image = base64Image;
                    requestRidesWithProfileImage.push(requestRide);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.log(`User with ID ${passengerId} does not have an image`);
                    } else {
                        console.log(`Error retrieving profile image for user with ID ${passengerId}:`, error);
                    }
                }
            }
            console.log(requestRidesWithProfileImage)
            setRequestRide(requestRidesWithProfileImage);
        } catch (error) {
            console.log('Error fetching trips:', error);
        }
    };


    useEffect(() => {
        fetchRideRequests();
    }, []);


    const handleDeleteRequest = async (requestRideId, status) => {
        setIsHiddenItemVisible(false);

        try {
            const response = await axios.put(`https://6e65-197-2-231-204.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'The request has been declined.',
            });
            setRequestRide(prevState => prevState.filter(request => request.requestRideId !== requestRideId));

            fetchRideRequests();
            setIsHiddenItemVisible(true);

            return response.data;
        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };


    const handleAcceptRequest = async (requestRideId, status) => {
        setIsHiddenItemVisible(false);

        console.log(requestRideId)
        try {
            const response = await axios.put(`https://6e65-197-2-231-204.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            Toast.show({
                type: 'info',
                text1: 'Success',
                text2: 'The ride request has been accepted successfully. A new booking is created :)',

            });
            setRequestRide(prevState => prevState.filter(request => request.requestRideId !== requestRideId));

            fetchRideRequests();
            setIsHiddenItemVisible(true);

            return response.data;

        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };




    const renderItem = ({
        item,
        index
    }) => <Box>
            <Pressable onPress={() => console.log(isHiddenItemVisible)} _dark={{ bg: 'coolGray.800' }} _light={{ bg: 'white' }}>
                <Box pl="4" pr="5" py="3">
                    <HStack alignItems="center" space={3}>
                        <Image source={{ uri: `data:image/jpeg;base64,${item.passenger.image}` }} style={{ width: 50, height: 50, borderRadius: 50 }} alt="driverimg" />

                        <VStack>
                            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
                                {item.passenger.firstName} {item.passenger.lastName}
                            </Text>
                            <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }} numberOfLines={null}>
                                {item.source} To {item.destination}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="xs" color="coolGray.800" _dark={{ color: 'warmGray.50' }} alignSelf="flex-start">
                            12.30 pm
                        </Text>
                    </HStack>
                </Box>
            </Pressable>
        </Box>

    const renderHiddenItem = ({ item }) => {

        if (!isHiddenItemVisible) {
            return null; 
        }

        return (
            // Render the hidden item
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                {/* Accept button */}
                <Pressable
                    w="70"
                    cursor="pointer"
                    bg="green.500"
                    justifyContent="center"
                    onPress={() => handleAcceptRequest(item.requestRideId, 'Accepted')}
                    _pressed={{ opacity: 0.5 }}
                >
                    <VStack alignItems="center" space={2}>
                        <AntDesign name="checkcircle" size={24} color="white" />
                    </VStack>
                </Pressable>

                {/* Delete button */}
                <Pressable
                    w="70"
                    cursor="pointer"
                    bg="red.500"
                    justifyContent="center"
                    onPress={() => handleDeleteRequest(item.requestRideId, 'Declined')}
                    _pressed={{ opacity: 0.5 }}
                >
                    <VStack alignItems="center" space={2}>
                        <Entypo name="circle-with-cross" size={24} color="white" />
                    </VStack>
                </Pressable>
            </View>
        );
    };


    return (
        <View>
            {requestRide.length === 0 ? (
                <View style={styles.container}>
                    <HomeSvg />

                    <View>
                        <Text style={styles.text} >
                            You have no ride requests for now !
                        </Text>
                    </View>
                </View>
            ) : (
                <SwipeListView
                    data={requestRide}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-150} // Width of the hidden items view
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-around',

    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2c2c3b',
    },
    text: {
        marginTop: '3%',
        fontSize: 25,
    },
});