import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity, HStack, Switch, FlatList } from 'react-native';
import { Box, Icon, Stack, Center, Input, FormControl, TextArea, Divider, Fab } from "native-base";
import Modal from 'react-native-modal';
import { Badge } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { TouchableWithoutFeedback } from 'react-native';
import carData from "./car-list.json";
import { Dimensions } from 'react-native';

export default function CarInfo({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [brandNames, setBrandNames] = useState([]);
    const [selectedCarbrand, setSelectedCarbran] = useState("");

    useEffect(() => {
        // Set initial brand names when the component mounts
        const allBrandNames = carData.map((car) => car.brand);
        setBrandNames(allBrandNames);
    }, []);

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
        const filteredBrands = carData.filter((car) =>
            car.brand.toLowerCase().includes(query.toLowerCase())
        );
        const brandNames = filteredBrands.map((car) => car.brand);
        setBrandNames(brandNames);
    };

    const handleSelectBrand = (brand) => {
        setSearchQuery(brand);
        const selectedCar = carData.find((car) => car.brand === brand);
        setSelectedCarbran(selectedCar.brand)
        console.log("Selected car brand:", selectedCar.brand);
        console.log("Car models:", selectedCar.models);
    };

    const displayUploadCarImageComponent = () => {
        console.log("test")
        navigation.replace('uploadcarimg', {
            CarBrand: selectedCarbrand
        })
    };

    const windowHeight = Dimensions.get('window').height;
    const maxListHeight = windowHeight - 100; // Adjust the value based on your needs

    return (
        <TouchableWithoutFeedback >
            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            marginHorizontal: 20,
                            marginTop: 30,
                            borderWidth: 1,
                            borderColor: '#ccc',
                        }}
                        value={searchQuery}
                        onChangeText={handleSearchQueryChange}
                        placeholder="Search for a brand"
                    />

                    <View style={{ maxHeight: maxListHeight, marginVertical: 5, marginHorizontal: 20, overflow: 'scroll' }}>
                        <FlatList
                            data={brandNames}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback onPress={() => {
                                    handleSelectBrand(item);
                                }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: '#d4d4d4', paddingVertical: 10, marginVertical: 3 }}>
                                        <Text style={styles.textStyle}>
                                            {item}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                            keyExtractor={(item) => item}
                        />
                    </View>
                </View>


                <Fab renderInPortal={false} shadow={2} size="sm" onPress={displayUploadCarImageComponent} icon={<Icon color="white" as={AntDesign} name="arrowright" size="sm" />}
                    style={{ backgroundColor: '#2c2c3b' }}
                />

            </View>

        </TouchableWithoutFeedback >
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
});