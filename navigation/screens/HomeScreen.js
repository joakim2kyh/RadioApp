import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';

export function HomeScreen({ navigation, component }) {

  const [channels, setChannels] = useState([])
  const [schedule, setSchedule] = useState([])
  const [favourites, setFavourites] = useState([])
  const [live, setLive] = useState("")
  const [refresh, setRefresh] = useState([true])
  const [pageNumber, setPageNumber] = useState(2)
  const [filter, setFilter] = useState(0)

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');

      getData()
      // .then(console.info("fav " + favourites))

    }, [])
  );

  useEffect(() => {
    storeData(favourites)
    console.log("used effect 1")
  }, [favourites])

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
      setFavourites(json);
    } catch (e) {
      console.log(e)
    }
  }


  

  const addFavorite = (item) => {
    let ids = favourites.map(o => o.id)
    if (!ids.includes(item.id)) {
      setFavourites([...favourites, item])
      console.log("added " + item.id)
    } else {
      setFavourites(favourites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favourites)
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
            <Text style={{color: filter === 0 ? 'red' : 'black'}}>Rikskanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Lokal%20kanal")
            setFilter(1)}}>
            <Text style={{color: filter === 1 ? 'red' : 'black'}}>Lokala kanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Minoritet%20och%20språk")
            setFilter(2)}}>
            <Text style={{color: filter === 2 ? 'red' : 'black'}}>Minoritet & språk</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Extrakanaler")
            setFilter(3)}}>
            <Text style={{color: filter === 3 ? 'red' : 'black'}}>Extrakanaler</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Fler%20kanaler")
            setFilter(4)}}>
            <Text style={{color: filter === 4 ? 'red' : 'black'}}>Fler kanaler</Text>
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
      <View style={styles.bottomBar}>
        <View style={styles.channelContainer}>

          <Text style={styles.channelImage}>P1</Text>
          <View style={styles.programContainer}>
            <Text style={styles.programTitle}>Klassisk förmiddag</Text>
            <Text style={styles.programTime}>11.11-12.09</Text>
          </View>
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
    height: '92%',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },

  bottomBar: {
    backgroundColor: 'white',

    // width: '100%',
    height: '8%',

  },

  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80


  },

  channelImage: {
    backgroundColor: 'blue',
    color: 'white',
    width: 80,
    flex: 1

  },

  programContainer: {
    backgroundColor: 'black',
    color: 'white',

  },
  programTitle: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    height: '50%',
    width: 200,
    flex: 3


  },

  programTime: {
    color: 'white',
    height: '50%',

  },

  play: {
    flex: 1

  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    margin: 4
  },
  text: {
   // color: 'tomato'
  }

});