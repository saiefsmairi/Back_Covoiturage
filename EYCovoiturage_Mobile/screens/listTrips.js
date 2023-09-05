import React, { useState, useEffect } from "react";
import TripCard from "../components/tripCard";
import { View, StyleSheet, Text, ScrollViewProps, RefreshControl } from 'react-native';
import axios from "axios";
import { ScrollView, HStack, Heading, Spinner, Box } from 'native-base';
import Slider from '@react-native-community/slider';
import SelectDropdown from 'react-native-select-dropdown';
import { AntDesign } from '@expo/vector-icons';
export default function ListTrips({ navigation, route }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [distance, setDistance] = useState(1);
  const options = ['All', 'Regular', 'Occasional'];
  const [selectedOption, setSelectedOption] = useState("All");
  const handlePress = (trip) => {
    navigation.navigate('rideDetails', {
      trip
    });
  };

  const { userPickupLatitude, userPickupLongitude, userDropLatitude, userDropLongitude, selectedDate } = route.params;

  useEffect(() => {
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://4466-197-2-98-33.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
            selectedDate,
            type: selectedOption
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
    setRefreshing(true);
    console.log(userPickupLatitude + " " + userPickupLongitude + " " + userDropLatitude + " " + userDropLongitude)
    setIsLoading(true)
    const fetchTrips = async () => {
      //  setIsLoading(true); // Set isLoading to true before making the API call
      try {
        const response = await axios.get('https://4466-197-2-98-33.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
            range: distance,
            selectedDate,
            type: selectedOption
          },
        });
        setTrips(response.data);
        console.log("***")
        console.log(response.data)

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
        const response = await axios.get('https://4466-197-2-98-33.ngrok-free.app/api/Trip/filter', {
          params: {
            userPickupLatitude,
            userPickupLongitude,
            userDropLatitude,
            userDropLongitude,
            range,
            selectedDate,
            type: selectedOption
          },
        });
        setTrips(response.data);
        console.log(response.data)
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

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    fetchFilteredTripsByType(option);

  };

  const fetchFilteredTripsByType = async (selectedOption) => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://4466-197-2-98-33.ngrok-free.app/api/Trip/filter', {
        params: {
          userPickupLatitude,
          userPickupLongitude,
          userDropLatitude,
          userDropLongitude,
          range: distance,
          selectedDate,
          type: selectedOption,
        },
      });
      const data = response.data;
      setTrips(response.data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

      <View style={styles.containerSelect}>
        <SelectDropdown style={{ marginTop: 30 }}
          data={options}
          onSelect={handleOptionSelect}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return <AntDesign name={isOpened ? 'up' : 'down'} color={'#444'} size={18} />;
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
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
  containerSelect: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20
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
  dropdown1BtnStyle: {
    width: '60%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
  dropdown1BtnTxtStyle: { color: '#444', fontSize: 15 },
  dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
});