import { View, Text, Button, FlatList, StyleSheet, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';
import SoundHandler from '../../components/SoundHandler';

export function HomeScreen({ navigation, component }) {

  const [channels, setChannels] = useState([])
  const [favorites, setFavorites] = useState([])
  const [refresh, setRefresh] = useState([true])
  const [filter, setFilter] = useState(0)
  const soundManager = new SoundHandler()

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');

      getData()
        // .then(console.info("fav " + favorites))

    }, [])
  );

  useEffect(() => {
    fetchList2("Rikskanal")
    getData()
    //console.log("used effect 2")
  }, [])
  
  useEffect(() => {
    storeData(favorites)
    //console.log("used effect 1")
  }, [favorites])

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

      return json;
    } catch (error) {
      console.error(error);
    }
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
          {/* <Pressable style={styles.button} onPress={() => {
            fetchList2("Extrakanaler")
            setFilter(3)}}>
            <Text style={{color: filter === 3 ? 'black' : 'gray', fontWeight: filter === 3 ? 'bold' : 'normal'}}>Extrakanaler</Text>
          </Pressable> */}
          <Pressable style={styles.button} onPress={() => {
            fetchList2("Fler%20kanaler")
            setFilter(4)}}>
            <Text style={{color: filter === 4 ? 'black' : 'gray', fontWeight: filter === 4 ? 'bold' : 'normal'}}>Fler kanaler</Text>
          </Pressable>


          </View>
      <FlatList
        style={styles.flatlist}
        data={channels}
        extraData={
          refresh
        }
        renderItem={({ item }) => (
          <Card item={item} playRadio={(live) => {soundManager.playRadio(item, live), setRefresh({ refresh: !refresh }) }}
          addFavorite={() => addFavorite(item)} onPress={
            (schedule) => {
              navigation.navigate('PlayScreen', { item: item, schedule: schedule})
            }
          } />
        )}
      />
        { soundManager.isPlaying ? <MiniPlayer 
        setRefreshList={setRefresh} 
        refreshList={refresh} 
        onPress={
            (schedule) => {
              navigation.navigate('PlayScreen', { item: soundManager.channel, schedule: schedule })
            }
          } /> : null }
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '92%',
    marginTop: 30,
   // backgroundColor: '#F5FCFF',
   backgroundColor: '#f5eee7'
  },

  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },

  button: {
    marginLeft: 6
  },

  flatlist: {
   // backgroundColor: '#F5FCFF'
   backgroundColor: '#f5eee7'
  }


});