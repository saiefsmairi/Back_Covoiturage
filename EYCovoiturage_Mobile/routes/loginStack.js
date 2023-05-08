import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import login from '../screens/login'
import register from '../screens/register'
import Login from '../screens/login';
import RideDetails from '../screens/rideDetails';
import MyTabs from './mytabs';
import IntroAddTrip from '../screens/introAddTrip';
import ListTrips from '../screens/listTrips';
import Profil from '../screens/profil';

const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="login"
        >
            <Stack.Screen options={{ headerShown: false }} name="main" component={MyTabs} />
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
                        backgroundColor: 'yellow',
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
                    headerShown: false,
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
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Home',
                }}
            />
        </Stack.Navigator>
    );
}

export default MyStack;