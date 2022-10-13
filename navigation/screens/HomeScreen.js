import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Audio } from "expo-av";
import React, {useState} from 'react';

export default function HomeScreen({navigation}) {

    const sound = new Audio.Sound()
    const [channels, setChannels] = useState([])
    let musiclibrary = []

    const fetchList2 = async () => {
        try {
            let response = await fetch("http://api.sr.se/api/v2/channels?format=json");
            let json = await response.json();
            setChannels(json.channels)
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

        <Text>Hallå där kompis Open up App.js to start working on your app!</Text>
        <Button title='Fetch list' onPress={fetchList2}></Button>
        <FlatList
            data={channels}
            renderItem={({ item }) => (
                <Text style={styles.item}>{item.name}</Text>
            )}
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    item: {
      marginTop: 24,
      padding: 30,
      backgroundColor: "pink",
    }
  });