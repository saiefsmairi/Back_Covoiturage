import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/login';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './routes/loginStack';
import { NativeBaseProvider, Box } from "native-base";

export default function App() {
  return (

    <NavigationContainer>
          <NativeBaseProvider>

      <MyStack />
      </NativeBaseProvider>

    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
});