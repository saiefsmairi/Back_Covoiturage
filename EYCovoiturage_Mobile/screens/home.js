import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReactComponent as MySVG } from '.././assets/homesvg.svg';
import HomeSvg from '../components/homesvg';
function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeSvg />
      <View>
        <Text style={styles.title}>Your future rides will appear here.</Text>
        <Text style={styles.text} >
          Find the perfect route among thousands of destinations or publish routes.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    justifyContent: 'space-around',

  },
  title: {
    fontSize: 'xxx-large',
    fontWeight: 'bold',
    color: '#2c2c3b',
  },
  text: {
    marginTop: '3%',
    fontSize: 'x-large',
  },
});

export default HomeScreen;
