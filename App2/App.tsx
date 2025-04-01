/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {ComponentType, Suspense, useEffect, useState} from 'react';
// import type {PropsWithChildren} from 'react';
// import {Platform} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Appbar, Searchbar} from 'react-native-paper';
import MyScreen from './MyScreen';
const MemberCard = React.lazy(() => import('App1/MemberCard'));
console.log(MemberCard);

const Header = () => (
  <Appbar.Header style={{backgroundColor: '#4f59df'}}>
    <Appbar.Content title="Shell Appss" color="#fff" />
    <Appbar.Action icon="magnify" onPress={() => {}} />
    <Appbar.Action icon="dots-vertical" onPress={() => {}} />
  </Appbar.Header>
);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <PaperProvider>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <Header />
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: '#eeeeee',
            margin: 10,
            borderColor: 'grey',
            borderWidth: 1,
            color: '#000',
          }}
          placeholderTextColor={'#000'}
          value={searchQuery}
        />
        <View>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <ScrollView></ScrollView>
          <Suspense fallback={<Text>Loading</Text>}>
            <MemberCard />
          </Suspense>
        </View>
      </SafeAreaView>
    </PaperProvider>
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
