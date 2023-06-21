import React, { useState, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollViewProps, RefreshControl } from 'react-native';
import axios from "axios";
import { ScrollView, HStack, Heading, Spinner, Box } from 'native-base';
import Slider from '@react-native-community/slider';

export default function ListTrips({ navigation, route }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [distance, setDistance] = useState(1);

  const handlePress = (trip) => {
    navigation.navigate('rideDetails', {
      trip
    });
  };

  const { userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude } = route.params;

  useEffect(() => {
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://4183-145-62-80-62.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
          },
        });
        setTrips(response.data);
        //console.log(response.data)
      } catch (error) {
        console.log('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setTrips([]);
    fetchTrips();
  }, [userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude])

  const onRefresh = async () => {

    console.log("on refresh pressed")
    console.log(distance)
    setRefreshing(true);
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://4183-145-62-80-62.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
            range:distance
          },
        });
        setTrips(response.data);
        console.log("***")
        console.log(response)

      } catch (error) {
        console.log('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setTrips([]);
    fetchTrips();
    setDistance(distance);
    setRefreshing(false);
  };

  const onSliderValueChanged = (range) => {
    setDistance(range);
    setRefreshing(true);
    setIsLoading(true)
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://4183-145-62-80-62.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
            range
          },
        });
        setTrips(response.data);
      } catch (error) {
        console.log('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setTrips([]);
    fetchTrips();
    setRefreshing(false);
  };

  return (
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <View style={styles.container}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          value={distance}
          step={1}
          minimumTrackTintColor="#00BFFF"
          maximumTrackTintColor="#00BFFF"
          thumbTintColor="#00BFFF"
          onValueChange={onSliderValueChanged}
        />
        <View style={styles.labelsContainer}>
          <Text style={styles.label}>1 km</Text>
          <Text style={styles.label}>20 km</Text>
        </View>
        <Text style={{ fontSize: 13 }}>Range: {distance} km</Text>
      </View>

      {isLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center" style={{ marginTop: 20 }}>
          <HStack space={2} justifyContent="center" alignItems="center">
            <Spinner accessibilityLabel="Loading trips" size="lg" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Box>


      ) : (
        <Box style={{ marginTop: 20 }} >
          {trips && trips.length === 0 ? (
            <Text>There are no trips close to your locations</Text>
          ) : (
            trips.map((trip) => <TripCard key={trip.trip.tripId} trip={trip} onPress={() => handlePress(trip)} />)
          )}

        </Box>
      )}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    color: "grey"
  },
});