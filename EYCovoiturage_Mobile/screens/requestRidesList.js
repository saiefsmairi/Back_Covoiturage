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

export default function RequestRidesList({ }) {
    const [isLoading, setIsLoading] = useState(false);
    const [requestRide, setRequestRide] = useState([]);
    const fetchRideRequests = async () => {
        try {
            const response = await axios.get(`https://197d-145-62-80-62.ngrok-free.app/api/RequestRide/requests/2`);
            console.log("////REQUESTSTS///")
            console.log(response.data)
            setRequestRide(response.data)
        } catch (error) {
            console.log('Error fetching trips:', error);
        }
    };
    useEffect(() => {
        //fetch request for user who is logging in ! for test i will put static value w baad taw nekhou mel local storage
        fetchRideRequests();
    }, []);


    const handleDeleteRequest = async (requestRideId, status) => {
        try {
            const response = await axios.put(`https://197d-145-62-80-62.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                // Perform the logic to accept the request
            }, 2000);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'The request has been declined.',
            });
            fetchRideRequests();

            return response.data;
        } catch (error) {
            console.error('Error updating ride request status:', error);
            throw error;
        }
    };


    const handleAcceptRequest = async (requestRideId, status) => {
        try {
            const response = await axios.put(`https://197d-145-62-80-62.ngrok-free.app/api/RequestRide/requests/${requestRideId}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            Toast.show({
                type: 'info',
                text1: 'Success',
                text2: 'The ride request has been accepted successfully. A new booking is created :)',

            });
            fetchRideRequests();

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
            <Pressable onPress={() => console.log('You touched me')} _dark={{ bg: 'coolGray.800' }} _light={{ bg: 'white' }}>
                <Box pl="4" pr="5" py="3">
                    <HStack alignItems="center" space={3}>
                        <Avatar size="48px" source={{ uri: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg" }} />
                        <VStack>
                            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
                                saif smairi
                            </Text>
                            <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }} numberOfLines={null}>
                                Trip: source To destination
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

    const renderHiddenItem = ({ item }) => (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>

            <Pressable w="70" cursor="pointer" bg="green.500" justifyContent="center" onPress={() => handleAcceptRequest(item.requestRideId, "Accepted")} _pressed={{
                opacity: 0.5
            }}>
                <VStack alignItems="center" space={2}>

                    <AntDesign name="checkcircle" size={24} color="white" />
                </VStack>
            </Pressable>
            <Pressable w="70" cursor="pointer" bg="red.500" justifyContent="center" onPress={() => handleDeleteRequest(item.requestRideId, "Declined")} _pressed={{
                opacity: 0.5
            }}>
                <VStack alignItems="center" space={2}>
                    <Entypo name="circle-with-cross" size={24} color="white" />

                </VStack>
            </Pressable>
        </View>
    );

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