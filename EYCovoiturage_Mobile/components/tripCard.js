import React from "react";
import { Box, Divider, Avatar, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider } from "native-base";
import { TouchableOpacity } from "react-native";

const TripCard = ({ onPress }) => {
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
          <Box  >
            <Stack p="4" space={3} >
              <Stack space={2} >
                <Heading size="sm" ml="-1" >
                  Menzah 5 -&gt; EY Tunisie
                </Heading>
                <Text
                  fontSize="xs"
                  _light={{ color: "violet.500" }}
                  _dark={{ color: "violet.400" }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1"
                >
                  9:00 A.M to 12:00 P.M
                </Text>
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
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  }}
                >
                  AJ
                </Avatar>
                <Text ml="4" fontWeight="bold">
                  Alice Johnson
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
