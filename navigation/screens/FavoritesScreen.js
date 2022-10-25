import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';
import SoundHandler from '../../components/SoundHandler';


export function FavoritesScreen({ navigation }) {

  const [favorites, setFavorites] = useState([])
  const [refresh, setRefresh] = useState([true])
  const soundManager = new SoundHandler()

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {      
      getData()
        // .then(console.info("fav " + favorites))

    }, [])
  );

  useEffect(()=>{
    storeData(favorites)
  },[favorites])

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
      data={favorites} 
      extraData = {refresh}
      renderItem={({ item }) => (
        <Card item={item} playRadio={(live) => {soundManager.playRadio(item, live), setRefresh({ refresh: !refresh }) }}
          addFavorite={() => addFavorite(item)} onPress={
            (schedule) => {
              navigation.navigate('PlayScreen', { item: item, schedule: schedule })
            }
          } />
      )}
      /> 
      { global.soundHandler.isPlaying ? <MiniPlayer onPress={
            (schedule) => {
              navigation.navigate('PlayScreen', { item: soundManager.channel, schedule: schedule })
            }
          }  /> : null}
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

