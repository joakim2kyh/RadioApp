import { View, FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';
import SoundHandler from '../../components/SoundHandler';

export function FavoritesScreen({ navigation }) {

  const soundManager = new SoundHandler()
  const [favorites, setFavorites] = useState([])
  const [refresh, setRefresh] = useState([true])


  // Fetch favorites data from local storage when screen appears
  useFocusEffect(
    React.useCallback(() => {
      getData()
    }, [])
  );

  // Update local storage when favorites list changes
  useEffect(() => {
    storeData(favorites)
  }, [favorites])


  /**
     * removes current item from favorites list when user presses favorite button
     */
  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (ids.includes(item.id)) {
      setFavorites(favorites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favorites)
    }
  }

  /**
     * saves favorites list to internal storage and updates singleton class
     */  
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

  /**
     * fetches favorites list from internal storage
     */
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

      {/* Empty text to match spacing on HomeScreen */}
      <View style={styles.heading}>
        <Text></Text>
      </View>
      {/* List of channels */}
      <FlatList
        data={favorites}
        extraData={refresh}
        renderItem={({ item }) => (
          <Card item={item} playRadio={(live) => { soundManager.playRadio(item, live), setRefresh({ refresh: !refresh }) }}
            addFavorite={() => addFavorite(item)} onPress={
              (schedule) => {
                navigation.navigate('PlayScreen', { item: item, schedule: schedule })
              }
            } />
        )}
      />

      {/* Miniplayer */}
      {soundManager.showMiniplayer ? <MiniPlayer
        setRefreshList={setRefresh}
        refreshList={refresh}
        onPress={() => {
            navigation.navigate('PlayScreen', { item: soundManager.channel, schedule: soundManager.schedule })
          }
        } /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#f5eee7',
  },
  heading: {
    padding: 10,
  },
});