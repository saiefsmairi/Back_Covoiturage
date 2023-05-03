import React from "react";
import { Box } from "native-base";
import TripCard from "../components/tripCard";

export default function trips({ navigation }) {
    const handlePress = ({ }) => {
        console.log("pressed button")
        navigation.navigate('rideDetails');
    };
    return (
        <Box >
            <TripCard onPress={handlePress} />
            <TripCard onPress={handlePress} />
            <TripCard onPress={handlePress} />
        </Box>

    );
}

