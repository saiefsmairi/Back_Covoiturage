import React from "react";
import { Box } from "native-base";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollView } from 'react-native';

export default function ListTrips({ navigation }) {
    const handlePress = ({ }) => {
        console.log("pressed button")
        navigation.navigate('rideDetails');
    };
    return (
        <ScrollView>
        <Box >
            <TripCard onPress={handlePress} />
            <TripCard onPress={handlePress} />
            <TripCard onPress={handlePress} />
        </Box>
        </ScrollView>

    );
}

