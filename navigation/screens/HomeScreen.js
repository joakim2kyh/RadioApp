import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';

export function HomeScreen({ navigation, component }) {

  const [channels, setChannels] = useState([])
  const [schedule, setSchedule] = useState([])
  const [favorites, setFavorites] = useState([])
  const [live, setLive] = useState("")
  const [refresh, setRefresh] = useState([true])
  const [pageNumber, setPageNumber] = useState(2)
  const [filter, setFilter] = useState(0)

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');

      getData()
        // .then(console.info("fav " + favorites))

    }, [])
  );

  useEffect(() => {
    storeData(favorites)
    console.log("used effect 1")
  }, [favorites])

  useEffect(() => {
    fetchList2("Rikskanal")
    getData()
    console.log("used effect 2")
  }, [])

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      let commonFav = CommonDataManager.getInstance()
      let ids = value.map(item => item.id)
      commonFav.setFavIds(ids)
      setRefresh({
        refresh: !refresh
      })
      await AsyncStorage.setItem('idArray', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('idArray');
      let json = JSON.parse(jsonValue)
      let commonFav = CommonDataManager.getInstance()
      let ids = json.map(item => item.id)
      commonFav.setFavIds(ids)
      setFavorites(json);
    } catch (e) {
      console.log(e)
    }
  }


  

  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (!ids.includes(item.id)) {
      setFavorites([...favorites, item])
      console.log("added " + item.id)
    } else {
      setFavorites(favorites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favorites)
    }
  }



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

  const playRadio = (item) => {
    if (global.soundHandler.isPlaying && global.soundHandler.channel.id == item.id) {
      global.soundHandler.sound.pauseAsync()
      global.soundHandler.isPlaying = false
    } else {
      loadSound(item)
      global.soundHandler.isPlaying = true
    }
    setRefresh({
      refresh: !refresh
    })
  }

  async function loadSound(item) {
    await global.soundHandler.sound.unloadAsync()
      .then(global.soundHandler.channel = item)
    await global.soundHandler.sound.loadAsync({ uri: item.liveaudio.url })
    await global.soundHandler.sound.playAsync()
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
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Rikskanal")
            setFilter(0)}}>
            <Text style={{color: filter === 0 ? 'black' : 'gray', fontWeight: filter === 0 ? 'bold' : 'normal'}}>Rikskanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Lokal%20kanal")
            setFilter(1)}}>
            <Text style={{color: filter === 1 ? 'black' : 'gray', fontWeight: filter === 1 ? 'bold' : 'normal'}}>Lokala kanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Minoritet%20och%20spr&aring;k")
            setFilter(2)}}>
            <Text style={{color: filter === 2 ? 'black' : 'gray', fontWeight: filter === 2 ? 'bold' : 'normal'}}>Minoritet & språk</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Extrakanaler")
            setFilter(3)}}>
            <Text style={{color: filter === 3 ? 'black' : 'gray', fontWeight: filter === 3 ? 'bold' : 'normal'}}>Extrakanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Fler%20kanaler")
            setFilter(4)}}>
            <Text style={{color: filter === 4 ? 'black' : 'gray', fontWeight: filter === 4 ? 'bold' : 'normal'}}>Fler kanaler</Text>
          </Pressable>


          </View>
      <FlatList
        data={channels}
        extraData={
          refresh
        }
        renderItem={({ item }) => (
          <Card item={item} playRadio={() => playRadio(item)} addFavorite={() => addFavorite(item)} onPress={
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
          <MiniPlayer/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '92%',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },

  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },


});