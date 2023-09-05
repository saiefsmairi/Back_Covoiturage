/*

Concept: https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments

*/
import { Animated, Image, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Feather } from 'react-native-vector-icons';
import * as SecureStore from 'expo-secure-store';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';
import { Icon, Spinner } from 'native-base';
import axios from 'axios';

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 4;
const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const AnimatedExample = ({ navigation, verificationCode }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [userStorage, setUserStorage] = useState('');

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  React.useEffect(() => {
    const getData = async () => {
      try {
        const value = await SecureStore.getItemAsync('user');
        if (value !== null) {
          const user = JSON.parse(value);
          console.log(user)
          setUserStorage(user);
        } else {
          // Handle case when user data is not available
        }
      } catch (error) {
        // Handle error while retrieving user data
      }
    };

    getData();
    console.log(verificationCode)
  }, []);

  const handleVerify = () => {
    setLoading(true);

    if (value == verificationCode) {
      setVerificationResult(true)
      console.log('Verification successful');
    } else {
      console.log('Verification failed');
    }

    setTimeout(async () => {
      setLoading(false);
      if (value != verificationCode) {
        setVerificationResult(false)
      }
      else {
        try {
          const response = await axios.put(`https://4466-197-2-98-33.ngrok-free.app/api/User/${userStorage.email}/updateVerifyPhoneStatus`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          navigation.replace('main', { screen: 'profil' })
          return response.data;
        } catch (error) {
          console.error('Error updating verify phone number status:', error);
          throw error;
        }

      }
    }, 3000);
  };



  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
          inputRange: [0, 1],
          outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        })
        : animationsColor[index].interpolate({
          inputRange: [0, 1],
          outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Verification</Text>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        Please enter the verification code{'\n'}
        we send to your phone
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      {loading && <Spinner size="lg" />}

      {verificationResult === false && (
        <Feather name="x-circle" size={50} color="red" alignSelf="center" />
        // Show cross mark when verification fails
      )}


      <TouchableOpacity style={styles.nextButton} onPress={handleVerify}>
        <Text style={styles.nextButtonText} >Verify</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};


export default AnimatedExample;
