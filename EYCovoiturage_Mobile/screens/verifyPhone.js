import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollViewProps, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AnimatedExample from "../components/AnimatedExample";

export default function VerifyPhone({ route }) {
    const style = { flex: 1, backgroundColor: '#fff' };
    const navigation = useNavigation();

    React.useEffect(() => {
        console.log(route.params.VerifCode)
    }, []);

    return (
        <View style={style} >
            <AnimatedExample navigation={navigation} verificationCode={route.params.VerifCode} />

        </View>
    );
}

