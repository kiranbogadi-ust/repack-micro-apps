import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const CounterApp = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Counter App from App1_1</Text>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonContainer}>
          <Button title="-" onPress={() => setCount(count - 1)} color="red" />
          <Button title="+" onPress={() => setCount(count + 1)} color="red" />
        </View>
        <Button title="Reset" onPress={() => setCount(0)} color="green" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'aqua',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  count: {
    fontSize: 48,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
});

export default CounterApp;
