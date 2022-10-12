import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import { View,
  Text,
  StyleSheet,
  Button} from 'react-native';
import React from 'react';
import { musiclibrary } from './data';
console.log("hello")



export default function App() {
const sound = new Audio.Sound()
let channelsArray = []

const fetchList2 = async () => {
  try {
    let response = await fetch("http://api.sr.se/api/v2/channels?format=json%22");
    let json = await response.json();
    console.log(json.channels[0].liveaudio.url)
    channelsArray = json.channels
    console.log(json.channels)
    console.log({channelsArray})
    return json;
  } catch (error) {
    console.error(error);
  }
}

async function loadSound(uri) {
  await sound.loadAsync({
    uri: uri
  })
}

async function playSound() {
  await sound.playAsync()
}

async function pause() {
  await sound.pauseAsync()
}

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title='Fetch list' onPress={fetchList2}></Button>
      <Button title="Load audio" onPress={() => {loadSound(musiclibrary[0].url)}}></Button>
      <Button title="Play audio" onPress={playSound}></Button>
      <Button title="Pause audio" onPress={pause}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});