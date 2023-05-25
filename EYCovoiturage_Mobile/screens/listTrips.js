import React, { useState, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollViewProps } from 'react-native';
import axios from "axios";
import { ScrollView, HStack, Heading, Spinner, Box } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

export default function ListTrips({ navigation, route }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  const handlePress = (trip) => {
    console.log("pressed button")
   
    navigation.navigate('rideDetails', {
      trip
    });
  };


    const { userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude } = route.params;


    useFocusEffect(


       React.useCallback(() => {
        console.log(userPickupLatitude+" "+ userPickupLongitude+" "+ userDropLatitude+" "+ userDropLongitude)

           setIsLoading(true)

         const fetchTrips = async () => {
         //  setIsLoading(true); // Set isLoading to true before making the API call
           try {
             const response = await axios.get('https://197d-145-62-80-62.ngrok-free.app/api/Trip/filter', {
               params: {
                 userPickupLatitude,
                 userPickupLongitude,
                 userDropLatitude,
                 userDropLongitude,
               },
             });
             setTrips(response.data);
           } catch (error) {
             console.log('Error fetching trips:', error);
           } finally {
             setIsLoading(false); // Set isLoading to false after the API call is completed
           }
         };
     
         setTrips([]); // Empty the trips array when the screen gains focus
         fetchTrips();
       }, [userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude])
     ); 
 
 
/*    useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://bf15-197-3-153-179.ngrok-free.app/api/Trip');
        console.log("LLLLLLLLLLLLLLLLLL***")
        console.log(response.data)
        setTrips(response.data);
      } catch (error) {
        console.log('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);  */

  return (
    <ScrollView>
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
          {trips.map((trip, index) => (
            <TripCard key={index} onPress={() => handlePress(trip)} trip={trip} />
          ))}
        </Box>
      )}
    </ScrollView>


  );
}

