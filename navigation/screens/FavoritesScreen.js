import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';


export function FavoritesScreen({ navigation }) {

  const [favorites, setFavorites] = useState([])
  const [refresh, setRefresh] = useState([true])

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');
      
      getData()
        // .then(console.info("fav " + favorites))

    }, [])
  );

  useEffect(()=>{
    storeData(favorites)
  },[favorites])


  //depricated
  const fetchStation = async () => {
    try {      
        let response = await fetch(`http://api.sr.se/api/v2/channels/?format=json`);
        let json = await response.json();

        setChannels(json.channels)
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

  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (ids.includes(item.id)) {
      setFavorites(favorites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favorites)
    } 
  }

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
      setFavorites(json);
      console.info("json " + json)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
  <FlatList
      style={styles.flatlist}
      data={
        favorites
      } 
      extraData = {refresh}
      renderItem={({ item }) => (
        <Card item={item} playRadio={(live) => playRadio(item, live)} addFavorite={() => addFavorite(item)} onPress={
          (schedule) => { navigation.navigate('PlayScreen', { item: item, schedule: schedule }) }
        } />
      )}
      /> 
      { global.soundHandler.isPlaying ? <MiniPlayer /> : null}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '92%',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },
  flatlist: {
    backgroundColor: '#f5eee7'
   }
});

