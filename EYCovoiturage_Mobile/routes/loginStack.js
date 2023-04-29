import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import login from '../screens/login'
import register from '../screens/register'



const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="register"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#2196F3' },
            }}
        >
            <Stack.Screen
                name="login"
                component={login}
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



        </Stack.Navigator>
    );
}

export default MyStack;