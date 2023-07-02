import React from "react";
import { Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, View } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import UserAvatar from 'react-native-user-avatar';

const TripCard = ({ onPress, trip }) => {
  const formattedDepartureTime = moment(trip.trip.departureTime, "HH:mm:ss").format("HH:mm");
  const departureTime = moment(trip.trip.departureTime, 'HH:mm:ss');
  const estimatedTime = trip.trip.estimatedTime;
  const arrivalTime = departureTime.add(estimatedTime, 'minutes');
  const [profileImage, setProfileImage] = useState('');

  React.useEffect(() => {
    const getProfileImage = async () => {
      try {
        const response = await axios.get(`https://ac9d-41-62-206-48.ngrok-free.app/api/User/${trip.trip.userId}/profileImage`);
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
    getProfileImage();

  }, []);

  return (
    <TouchableOpacity onPress={onPress}>

      <Box >
        <Box mx="7" my="2" onPress={onPress}>
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
              <Stack p="3" space={1} >
                <Stack direction="row" justifyContent={"flex-end"}>
                  <Text
                    fontSize="xs"
                    fontWeight="400"
                    color="gray.500"
                    textAlign="right"
                  >
                    {trip.trip.availableSeats}  Seats left
                  </Text>
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Stack space={2}>
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                    >
                      {formattedDepartureTime}
                    </Text>
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                    >
                      {arrivalTime.format('HH:mm')}
                    </Text>
                  </Stack>

                  <Stack>
                    <Entypo name="flow-line" size={35} color="#47a7f4" />
                  </Stack>
                  <Stack space={2} style={{ flex: 1 }}>
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                      style={{ flexWrap: 'wrap', width: '100%' }}
                    >
                      &#x200E; {trip.trip.source}
                    </Text>
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                      style={{ flexWrap: 'wrap', width: '100%' }}
                    >
                      &#x200E; {trip.trip.destination}
                    </Text>
                  </Stack>

                </Stack>


                <Divider
                  w="100%"
                  my="2"
                  _light={{ bg: "muted.300" }}
                  _dark={{ bg: "muted.50" }}
                />
                <Stack direction="row" alignItems="center">
                  {profileImage ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={{ width: 50, height: 50, borderRadius: 50 }} alt="driverimg" />
                  ) : (
                    <UserAvatar size={40} name={trip.user.firstName} bgColor="#2596be" style={{ marginRight: 10 }} />

                  )}
                  <Text ml="4" fontWeight="bold">
                    {trip.user.firstName} {trip.user.lastName}
                  </Text>
                </Stack>

              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

    </TouchableOpacity>

  );
};


export default TripCard;