import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity, HStack, Switch } from 'react-native';
import { Box, Icon, Stack, Center, Input, FormControl, TextArea, Divider } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';
import { Badge } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function FinalAddTrip({ navigation, route }) {


    useEffect(() => {

    }, [route.params]);


    /*     const toggleSwitch = (preference) => {
            setUpdatedTrip((prevTrip) => ({
                ...prevTrip,
                preferences: {
                    ...prevTrip.preferences,
                    [preference]: !prevTrip.preferences[preference],
                },
            }));
        };
    
        const [updatedtrip, setUpdatedTrip] = useState({
            preferences: {
                music: false,
                smoke: false,
                food: false,
            },
            description: '',
          
        }) */


        const toggleSwitch = (preference) => {
            setUpdatedTrip((prevTrip) => ({
              ...prevTrip,
              [preference]: !prevTrip[preference],
            }));
          };
          
          const [updatedtrip, setUpdatedTrip] = useState({
            music: false,
            smoke: false,
            food: false,
            description: '',
          });
          
          const combinedTrip = {
            ...route.params.trip,
            ...updatedtrip,
          };

    const handleCreateTrip = () => {
        console.log(combinedTrip);
               axios.post("https://cb18-102-157-92-55.ngrok-free.app/api/Trip/addTrip", combinedTrip)
                   .then((response) => {
                       console.log("Trip created successfully!", response.data);
                       navigation.navigate('home');
                   })
                   .catch((error) => {
                       console.error(error);
                   });  
    };
    return (
        <ScrollView>
            <View>
                <Stack direction="column" my={2} mx={4} space={6} justifyContent="space-between">
                    <Stack direction="column" alignItems="center" space={2}>
                        <Image source={require('../assets/jaccepte.png')} style={{ width: 50, height: 50, }} />

                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Your ride is almost created!</Text>
                    </Stack>
                    <Stack direction="column">
                        <Text style={{ fontWeight: '400', fontSize: 15 }}>Got anything to add about the ride? Write it here</Text>
                        <Text style={{ textAlign: 'justify', color: 'grey', fontSize: 12 }}>
                            Eg: Flexible about when and where to meet? got limited space in the boot ? Need passengers to be punctual ? etc..
                        </Text>
                        <TextArea h={20} placeholder="Trip description" w="100%" maxW="300"
                            value={updatedtrip.description}
                            onChangeText={(text) => setUpdatedTrip((prevTrip) => ({ ...prevTrip, description: text }))}
                        />
                    </Stack>
                    <Stack direction="column">
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Text>Food</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={updatedtrip.food ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch('food')}
                                value={updatedtrip.food}
                            />
                        </Stack>
                        <Divider my="2" _light={{
                            bg: "muted.300"
                        }} _dark={{
                            bg: "muted.50"
                        }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Text>Music</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={updatedtrip.music ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch('music')}
                                value={updatedtrip.music}
                            />
                        </Stack>
                        <Divider my="2" _light={{
                            bg: "muted.300"
                        }} _dark={{
                            bg: "muted.50"
                        }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Text>Smoking</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={updatedtrip.smoke ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch('smoke')}
                                value={updatedtrip.smoke}
                            />
                        </Stack>
                    </Stack>
                    <Stack alignSelf="center"  >
                        <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
                            <Text style={styles.textStyle}>Create trip</Text>
                        </TouchableOpacity>
                    </Stack>
                </Stack>

            </View>


        </ScrollView>
    );

}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        alignItems: "center",
        backgroundColor: "#2c2c3b",
        padding: 10,
        width: 200
    },
    dateButtons: {
        alignItems: "center",
        padding: 10,
    },
    textStyle: {
        color: "#ffe600",
        fontWeight: 500
    },
    modal: {

        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    map: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2596be'
    },

    buttonText: {

        paddingHorizontal: 10,
    },

});