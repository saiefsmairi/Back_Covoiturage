import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export const Input = ({ label, iconName, error, password,
    onFocus = () => { }
    , ...props }) => {
    const [isFocused, setisFocused] = useState(false)
    const [hidepassword, sethidepassword] = useState(password)

    return (
        <View  style={{ marginTop: 40 }}>
            <Text style={styles.label} >{label}</Text>

            <View style={[styles.inputContainer, { borderColor: error ? 'red' : isFocused ? 'black' : '#f0f2fa', alignItems: 'center' }]}>
                <MaterialIcons name={iconName} size={24} color="black" style={{ marginRight: 10 }} />
                < TextInput style={{ flex: 1 }} secureTextEntry={hidepassword}
                    onFocus={() => {
                        onFocus();
                        setisFocused(true)
                    }}
                    onBlur={() => {
                        setisFocused(false)
                    }}
                    {...props} />

                {password && (
                    <Ionicons onPress={() => sethidepassword(!hidepassword)} name={hidepassword ? "eye-outline" : "eye-off-outline"} size={22} color="black" />

                )}
            </View>


            {error && (
                <Text style={{ color: 'red' }} >{error}</Text>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: 'grey',

    },
    inputContainer: {
        backgroundColor: '#f0f2fa',
        height: 55,
        borderWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 15
    },
});