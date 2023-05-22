import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Keyboard, Alert, Button, TouchableOpacity } from 'react-native';
import { Box, Heading, VStack, FormControl, Input, Center, NativeBaseProvider, Pressable, Icon, Stack } from "native-base";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import authService from "../services/authService";
import { MaterialIcons } from "@expo/vector-icons";


export default function Register({ navigation }) {

    const [loading, setLoading] = React.useState(false);
    const [show, setShow] = React.useState(false);

    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        lastName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        phone: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        adress: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        password: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),

    });

    useEffect(() => {
        /*   getDataFromStorage().then((val) => {
              if (val) {
                  navigation.navigate('AffectedZonesList')
              }
          }); */
    }, [])

    const handlePress = () => {
        navigation.navigate('login');
    };

    return (
        <ScrollView>

            <View style={styles.container} >

                <Center w="100%">
                    <Box safeArea p="2" w="90%" maxW="290" py="8" h="100%" >
                        <VStack space={3} mb="10">
                            <Image
                                style={styles.tinyLogo}
                                source={{
                                    uri: 'https://ey.co.il/wp-content/uploads/2021/11/logo-black.png',
                                }}
                            />
                            <Heading mt="1" color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }} fontWeight="medium" size="xs">
                                Sign up to continue!
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
                                        Already have an account? Signin now.
                                    </Heading>
                                </Text>
                            </TouchableOpacity>

                        </VStack>

                        <Formik
                            initialValues={{ email: '', firstName: '', lastName: '', phone: '', adress: '', password: '', confirmPassword: '' }}
                            validationSchema={SignupSchema}
                            onSubmit={async values => {
                                const response = await authService.register(values);
                                console.log(response);
                                console.log(values)
                                navigation.navigate('login')

                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View>
                                    <FormControl.Label>First Name</FormControl.Label>
                                    <Input
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        value={values.firstName} />
                                    {touched.firstName && errors.firstName && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.firstName}</Text>
                                    )}
                                    <FormControl.Label>Last Name</FormControl.Label>
                                    <Input
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        value={values.lastName} />
                                    {touched.lastName && errors.lastName && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.lastName}</Text>
                                    )}
                                    <FormControl.Label>Phone</FormControl.Label>
                                    <Input
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone} />
                                    {touched.phone && errors.phone && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.phone}</Text>
                                    )}
                                    <FormControl.Label>Adress</FormControl.Label>

                                    <Input
                                        onChangeText={handleChange('adress')}
                                        onBlur={handleBlur('adress')}
                                        value={values.adress} />
                                    {touched.adress && errors.adress && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.adress}</Text>
                                    )}
                                    <FormControl.Label>Email</FormControl.Label>

                                    <Input
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email} />
                                    {touched.email && errors.email && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.email}</Text>
                                    )}
                                    <FormControl.Label>Password</FormControl.Label>

                                    <Input
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                        </Pressable>} />
                                    {touched.password && errors.password && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.password}</Text>
                                    )}

                                    <FormControl.Label>Confirm password</FormControl.Label>

                                    <Input
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                        secureTextEntry
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.confirmPassword}</Text>
                                    )}

                                    <VStack space={3} mt="16" >
                                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                            <Text style={styles.textStyle}>REGISTER</Text>
                                        </TouchableOpacity>
                                    </VStack>

                                </View>

                            )}

                        </Formik>
                    </Box>
                </Center>


            </View>
        </ScrollView>

    )

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