/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {ComponentType, Suspense, useEffect} from 'react';
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
// import CounterApp from './CounterApp';
// const CounterApp = React.lazy(() => import('App1/CounterApp'));
const MemberCard = React.lazy(() => import('App1/MemberCard'));

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      <View>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView>
          <View style={styles.textHeading}>
            <Text style={styles.textValue}> Shell App </Text>
          </View>
        </ScrollView>
        <Suspense fallback={<Text>Loading</Text>}>
          <MemberCard />
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
