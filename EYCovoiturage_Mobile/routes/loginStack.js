import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import login from '../screens/login'
import register from '../screens/register'
import Login from '../screens/login';
import RideDetails from '../screens/rideDetails';
import MyTabs from './mytabs';
import IntroAddTrip from '../screens/introAddTrip';
import ListTrips from '../screens/listTrips';
import Profil from '../screens/profil';
import MapComponent from '../components/mapComponent';
import MapComponentDrop from '../components/mapComponentDrop';
import RouteDetails from '../components/routeDetails';
import FinalAddTrip from '../screens/finalAddtrip';
import CarInfo from '../screens/carInfo';
import UploadCarImage from '../screens/uploadCarImage';
import { useNotifications } from '../hooks/useNotifications';
import * as Notifications from "expo-notifications";
import * as SecureStore from 'expo-secure-store';
import VerifyPhone from '../screens/verifyPhone';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ChatScreen from '../components/ChatScreen';

const Stack = createNativeStackNavigator();

function MyStack() {
    const navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = React.useState(null);

    React.useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        const responseListener =
            Notifications.addNotificationResponseReceivedListener(
                handleNotificationResponse

            );

        return () => {
            if (responseListener)
                Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    const checkLoginStatus = async () => {
        try {
            const userData = await SecureStore.getItemAsync('user');
            const isLoggedIn = !!userData;
            setIsLoggedIn(isLoggedIn);
        } catch (error) {
            console.log('Error checking login status:', error);
        }
    };

    const handleNotificationResponse = (response) => {
        const data = response.notification.request.content.data;
        console.log(data)
        if (data.screen == "main") {
            navigation.navigate("main");
        }
        if (data.screen == "requestRidesList") {
            navigation.navigate("requestRidesList");
        }
    };
    React.useEffect(() => {
        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return null;
    }

    //  <Stack.Screen name="chat" component={ChatScreen} />

    return (

        <Stack.Navigator initialRouteName={isLoggedIn ? 'main' : 'login'}>
            <Stack.Screen options={{ headerShown: false }} name="main" component={MyTabs} />
            <Stack.Screen
                name="phoneNumberVerification"
                component={VerifyPhone}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: '',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen name="chat" component={ChatScreen} />

            <Stack.Screen
                name="login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="register"
                component={register}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="rideDetails"
                component={RideDetails}
                options={{
                    title: 'Ride Details',
                    headerStyle: {
                        backgroundColor: '#eede1d',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: '#2c2c3b',
                    },
                }}
            />

            <Stack.Screen
                name="listTrips"
                component={ListTrips}
                options={{
                    title: 'Available trips',
                    headerStyle: {
                        backgroundColor: '#eede1d',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: '#2c2c3b',
                    },
                }}
            />

            <Stack.Screen
                name="introAddTrip"
                component={IntroAddTrip}
                options={{
                    contentStyle: {
                        backgroundColor: '#FFFFFF'
                    },
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Home',
                }}
            />

            <Stack.Screen
                name="finalAddTrip"
                component={FinalAddTrip}
                options={{
                    contentStyle: {
                        backgroundColor: '#FFFFFF'
                    },
                    headerShown: true,
                    headerTitle: '',
                    headerShadowVisible: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Home',
                }}
            />

            <Stack.Screen
                name="profil"
                component={Profil}
                options={{
                    headerStyle: {
                        backgroundColor: '#ffe600',
                    },
                    headerTitleStyle: {
                        color: '#2c2c3b',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Home',
                }}
            />

            <Stack.Screen
                name="pickupMap"
                component={MapComponent}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Map1',
                }}
            />

            <Stack.Screen
                name="dropMap"
                component={MapComponentDrop}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Map2',
                }}
            />


            <Stack.Screen
                name="routeDetails"
                component={RouteDetails}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Map3',
                }}
            />

            <Stack.Screen
                name="addCarInfo"
                component={CarInfo}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Map3',
                }}
            />

            <Stack.Screen
                name="uploadcarimg"
                component={UploadCarImage}
                options={{
                    headerShown: true,
                    headerTitle: 'Upload car image',

                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Map3',
                }}
            />
        </Stack.Navigator>


    );
}

export default MyStack;