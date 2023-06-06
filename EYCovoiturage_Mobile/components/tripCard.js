import React from "react";
import { Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, View } from "native-base";
import { TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useEffect } from "react";
const TripCard = ({ onPress, trip }) => {

  React.useEffect(() => {

    console.log(trip.source)

  }, []);
  const { source, destination } = trip;

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

                <Stack direction="row" alignItems="center"  >
                  <Stack space={2}  >
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                    >
                      09:00 AM
                    </Text>
                    <Text
                      fontSize="sm"
                      _light={{ color: "#2e2e38" }}
                      _dark={{ color: "violet.400" }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                    >
                      22:00 PM
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
                      {trip.source}
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
                      {destination}
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
                  <Avatar
                    bg="green.500"
                    source={{
                      uri:
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                    }}
                  >
                    AJ
                  </Avatar>
                  <Text ml="4" fontWeight="bold">
                    Johnson Alice
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
