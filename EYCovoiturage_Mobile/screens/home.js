import React from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { ReactComponent as MySVG } from '.././assets/homesvg.svg';
import HomeSvg from '../components/homesvg';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TripCard from '../components/tripCard';
import { ScrollView, HStack, Heading, Spinner, Box } from 'native-base';
import axios from "axios";
import { TabView, TabBar } from 'react-native-tab-view';
import TripCardWithQRcode from '../components/tripCardWithQRcode';
import TripCardBooked from '../components/tripCardBooked';


function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [tripsPublished, setTripsPublished] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [isLoading, setIsLoading] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'booked', title: 'Booked' },
    { key: 'published', title: 'Published' },
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
          console.log('Data retrieved successfully:', value);
          return value;
        } else {
          console.log('Data not found.');
          return null;
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
        return null;
      }
    };

    const fetchAceeptedTripsForPassengers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://cc55-102-159-105-67.ngrok-free.app/api/Trip/passengers/1/trips/accepted');
        console.log(response.data);
        setTrips(response.data);
      } catch (error) {
        console.log('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };

    const fetchPublishedTripsForDrivers = async () => {
      try {
        const response = await axios.get('https://cc55-102-159-105-67.ngrok-free.app/api/Trip/user/2/trips');
        setTripsPublished(response.data);
      } catch (error) {
        console.log('Error fetching trips ForDrivers:', error);
      } finally {

      }
    };
    fetchAceeptedTripsForPassengers();
    fetchPublishedTripsForDrivers();
    getData();

    
  }, []);

  const onRefresh = async () => {
    console.log("on refresh pressed");
    setRefreshing(true);
    try {
      const response = await axios.get('https://cc55-102-159-105-67.ngrok-free.app/api/Trip/passengers/1/trips/accepted');
      setTrips(response.data);
    } catch (error) {
      console.log('Error fetching trips:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePress = (trip) => {
    console.log("pressed button");
    navigation.navigate('rideDetails', {
      trip
    });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'booked':
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            
            {!isLoading && trips.map((trip, index) => (
              <TripCardBooked key={index} onPress={() => handlePress(trip)} trip={trip} />
            ))}
          </ScrollView>
        );
      case 'published':
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {!isLoading && tripsPublished.map((trip, index) => (
              <TripCardWithQRcode key={index} onPress={() => handlePress(trip)} trip={trip} />
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#47a7f4' }}
      style={{ backgroundColor: 'white' }}
      activeColor="#47a7f4" // Customize the active tab text color
      inactiveColor="black" // Customize the inactive tab text color
    />
  );
  return (
    <View style={styles.container2}>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-around',
  },
  container2: {
    flex: 1,
    // marginTop: 20,

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c2c3b',
  },
  text: {
    margin: 15,

    fontSize: 20,
  },
});

export default HomeScreen;
