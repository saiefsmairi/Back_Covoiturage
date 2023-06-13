import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity, HStack, Switch, FlatList } from 'react-native';
import { Box, Icon, Stack, Center, Input, FormControl, TextArea, Divider, Fab } from "native-base";
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UploadCarImage({ navigation, route }) {
    const [profileImage, setProfileImage] = useState('');
    const CarBrand = route.params.CarBrand
    useEffect(() => {
        console.log(CarBrand)
    }, []);


    const handleProfilePhotoSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true
        });
        if (!result.canceled) {
            try {
                const formData = new FormData();
                formData.append('carPhoto', {
                    uri: result.assets[0].uri,
                    name: 'car_photo.jpg',
                    type: 'image/jpeg',

                });

                const value = await AsyncStorage.getItem('user');
                var userId = JSON.parse(value).id

                const response = await axios.put(
                    `https://6e65-197-2-231-204.ngrok-free.app/api/User/${userId}/uploadCar`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        params: {
                            CarBrand: CarBrand, 
                        },
                    }
                );
                setProfileImage(result.assets[0].uri);

                console.log('Profile photo uploaded successfully:', response.data);
            } catch (error) {
                console.log('Error uploading profile photo:', error);
            }
        }
        else {
            alert('You did not select any image.');
        }
    };

    const backToProfil = () => {
      
        navigation.replace('main', { screen: 'profil' })
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {profileImage ? (
                <Image
                    source={{ uri: profileImage }}
                    style={{ width: 400, height: 400 }}
                    resizeMode="contain"

                />) : (
                <TouchableOpacity onPress={handleProfilePhotoSelect}>
                    <Image
                        source={require('../assets/loadimage.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}

            <Fab renderInPortal={false} shadow={2} size="sm" onPress={backToProfil} icon={<Icon color="white" as={AntDesign} name="checkcircleo" size="sm" />}
                style={{ backgroundColor: '#2c2c3b' }}
            />
        </View>


    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    textStyle: {
        color: "#2596be",
        fontSize: 17,
        fontWeight: '400',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 8,
    },

});