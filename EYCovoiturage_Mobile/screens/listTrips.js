import React, { useState, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollViewProps, RefreshControl } from 'react-native';
import axios from "axios";
import { ScrollView, HStack, Heading, Spinner, Box } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

export default function ListTrips({ navigation, route }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const handlePress = (trip) => {
    navigation.navigate('rideDetails', {
      trip
    });
  };

  const { userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude } = route.params;
  /*  useFocusEffect(
     React.useCallback(() => {
       console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
       setIsLoading(true)
       const fetchTrips = async () => {
         //  setIsLoading(true); // Set isLoading to true before making the API call
         try {
           const response = await axios.get('https://6e65-197-2-231-204.ngrok-free.app/api/Trip/filter', {
             params: {
               userPickupLatitude,
               userPickupLongitude,
               userDropLatitude,
               userDropLongitude,
             },
           });
           setTrips(response.data);
           console.log("***")
           console.log(response)
         } catch (error) {
           console.log('Error fetching trips:', error);
         } finally {
           setIsLoading(false); // Set isLoading to false after the API call is completed
         }
       };
 
       setTrips([]); // Empty the trips array when the screen gains focus
       fetchTrips();
     }, [userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude])
   ); */

  useEffect(() => {
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://6e65-197-2-231-204.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
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
  }, [userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude])



  const onRefresh = async () => {
    console.log("on refresh pressed")
    setRefreshing(true);
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://6e65-197-2-231-204.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
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
    setRefreshing(false);
  };


  return (
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      {isLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <HStack space={2} justifyContent="center" margi>
            <Spinner accessibilityLabel="Loading posts" size="lg" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Box>

      ) : (
        <Box >
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

