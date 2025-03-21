/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Suspense, useEffect} from 'react';
// import type {PropsWithChildren} from 'react';
// import {Platform} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const CounterApp = React.lazy(() => import('App1/CounterApp'));

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView>
      <View>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView>
          <View style={styles.textHeading}>
            <Text style={styles.textValue}> App 2</Text>
          </View>
        </ScrollView>
        <Suspense fallback={<Text>Loading</Text>}>
          <CounterApp />
        </Suspense>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  textHeading: {
    alignItems: 'center',
    padding: 50,
  },
  textValue: {
    fontWeight: 800,
    fontSize: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
