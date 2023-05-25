import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './routes/loginStack';
import { NativeBaseProvider, Box } from "native-base";
import Toast from 'react-native-toast-message';

export default function App() {

  return (

    <NavigationContainer>
          <NativeBaseProvider>

      <MyStack />
      </NativeBaseProvider>
      <Toast />

    </NavigationContainer>

  );
}

