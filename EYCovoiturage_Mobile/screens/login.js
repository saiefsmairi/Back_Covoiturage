import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Heading, VStack, FormControl, Input, Center, NativeBaseProvider, Pressable, Icon, Stack } from "native-base";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import authService from "../services/authService";
import { MaterialIcons } from "@expo/vector-icons";
import { useNotifications } from '../hooks/useNotifications';


export default function Login({ navigation }) {

  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);

  const SigninSchema = Yup.object().shape({

    password: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),

    email: Yup.string().email('Invalid email').required('Required'),

  });

  const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotifications();

  useEffect(() => {
    /*   getDataFromStorage().then((val) => {
          if (val) {
              navigation.navigate('AffectedZonesList')
          }
      }); */
  }, [])
  const handlePress = () => {
    navigation.navigate('register');
  };

  return (
    <View style={styles.container}>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8" h="100%">
          <VStack space={3} mb="10">
            <Image
              style={styles.tinyLogo}
              source={{
                uri: "https://ey.co.il/wp-content/uploads/2021/11/logo-black.png"
              }}
            />
            <Heading
              mt="1"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200"
              }}
              fontWeight="medium"
              size="xs"
            >
              Sign in to continue!
            </Heading>
            <TouchableOpacity onPress={handlePress}>
              <Text>
                <Heading
                  mt="1"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200"
                  }}
                  fontWeight="medium"
                  size="xs"
                >
                  Don't have an account? Register now.
                </Heading>
              </Text>
            </TouchableOpacity>
          </VStack>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SigninSchema}
            onSubmit={async values => {
              const DeviceToken = await registerForPushNotificationsAsync();
              if (DeviceToken) {
                console.log('1111')
                values.DeviceToken = DeviceToken;
                values.AllowsNotifications = true;
                const response = await authService.login(values);
                if (response) {
                  navigation.navigate("main");
                }
                else {
                  setLoginError('Invalid credentials. Please check your email and password.');
                }

              }
              else {
                console.log('2222')
                const response = await authService.loginemulator(values);
                if (response) {
                  navigation.navigate("main");
                }
              }


            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={{ color: "red", fontSize: 12 }}>{errors.email}</Text>
                )}
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  type={show ? "text" : "password"}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)}>
                      <Icon
                        as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                        size={5}
                        mr="2"
                        color="muted.400"
                      />
                    </Pressable>
                  }
                />
                {touched.password && errors.password && (
                  <Text style={{ color: "red", fontSize: 12 }}>{errors.password}</Text>
                )}
                {loginError && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{loginError}</Text>
                )}
                <VStack space={3} mt="16">


                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.textStyle}>Login</Text>
                  </TouchableOpacity>
                </VStack>
              </View>
            )}
          </Formik>
        </Box>
      </Center>
    </View>
  );




}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*  alignItems: 'center',
     justifyContent: 'center', */
  },
  container2: {

    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#2c2c3b",
    padding: 10,

  },
  textStyle: {
    color: "yellow",
    fontWeight: 500
  }
});