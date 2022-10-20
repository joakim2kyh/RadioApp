import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

export function HomeScreen({ navigation, component }) {

  const [channels, setChannels] = useState([])
  const [schedule, setSchedule] = useState([])
  const [favourites, setFavourites] = useState([])
  const [live, setLive] = useState("")
  const [pageNumber, setPageNumber] = useState(2)

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      console.info(jsonValue)
      await AsyncStorage.setItem('idArray', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('idArray')
      console.info("data = " + JSON.parse(jsonValue))
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log(e)
    }
  }

  const playRadio = () => {
    getData()
  }

  const addFavorite = (item) => {
    console.log(item)
    if (favourites.includes(item) == false) {
      setFavourites([...favourites, item])
      console.log("added " + item)
    } else {

      setFavourites(favourites.filter(name => name != item))
      console.info("deleted item " + item + " from " + favourites)
    }
  }

  useEffect(() => {
  //  fetchList2("Lokal%20kanal")
  fetchList2("Rikskanal")
    //console.info("effect " + favourites)
    storeData(favourites)
  }, [favourites])

  const fetchList2 = async (channeltype) => {
    try {
     // let response = await fetch(`http://api.sr.se/api/v2/channels?format=json${page}`);
      let response = await fetch(`https://api.sr.se/api/v2/channels?format=json&pagination=false&filter=channel.channeltype&filtervalue=${channeltype}`)
      let json = await response.json();
      setChannels(json.channels)
      // if (page == "") {
      //   console.log("page =", pageNumber)
      //   setChannels(json.channels)
      // } else {
      //   // let channelsArray = [...channels, json.channels]
      //   const channelsArray = channels.concat(json.channels)
      //   setChannels(channelsArray)
      //   // console.log("channels 71", channels)
      // }

      return json;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchSchedule = async (uri) => {
    try {
      const response = await fetch(uri);
      let json = await response.json();
      setSchedule(json.schedule)
      const now = Date.now()

      schedule.forEach(element => {

        let startTime = element.starttimeutc
        startTime = startTime.slice(6, -2)
        let endTime = element.endtimeutc
        endTime = endTime.slice(6, -2)

        if (startTime < now && endTime > now) {
          console.log(element.title)
          console.log(live)
          setLive(element.title)
        } else {
          //console.log("NOPE") 
        }

      });
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

        <View style={styles.filterButtons}>
          <Pressable style={styles.button} onPress={() => fetchList2("Rikskanal")}>
            <Text style={styles.text}>Rikskanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => fetchList2("Lokal%20kanal")}>
            <Text style={styles.text}>Lokala kanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => fetchList2("Minoritet%20och%20språk")}>
            <Text style={styles.text}>Minoritet & språk</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => fetchList2("Extrakanaler")}>
            <Text style={styles.text}>Extrakanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => fetchList2("Fler%20kanaler")}>
            <Text style={styles.text}>Fler kanaler</Text>
          </Pressable>

        </View>
        <FlatList
          data={channels}
          renderItem={({ item }) => (
            <Card item={item} playRadio={() => playRadio()} addFavorite={() => addFavorite(item.id)} onPress={
              () => {
                navigation.navigate('PlayScreen', { item: item })
              }
            } />
          )}
          // ListFooterComponent={() => <Button title='ladda fler' onPress={() => {

          //   setPageNumber((prev) => prev + 1)
          //   console.log("pageNumber", `&page=${pageNumber}`)
          //   // fetchList2(`&page=${pageNumber}`)

          // }}></Button>}
        />
          <View style={styles.bottomBar}>
            <View style={styles.channelContainer}>
              <Text style={styles.channel}>P1</Text>
              <Text style={styles.program}>Nu körs p1, ekot</Text>
              <TouchableOpacity style={styles.play} onPress={() => console.log('hej he hej')}>
                <AntDesign style={styles.playss} name="play" size={35} color="black" />
              </TouchableOpacity>
            </View>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '90%',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },

  bottomBar: {
    backgroundColor: 'white',

    // width: '100%',
    height: '10%',

  },
  left: {

  },
  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',


  },
  channel: {
    backgroundColor: 'red',
    height: 80,
    width: 80,
    flex: 1

  },
  program: {
    backgroundColor: 'green',
    height: 80,
    width: 200,
    flex: 3


  },
  play: {
    flex: 1

  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    color: 'tomato',
    margin: 4
  }

});