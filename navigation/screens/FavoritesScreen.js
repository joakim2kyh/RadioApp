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


  //get data about favotite when favorite screen is opened
  useFocusEffect(
    React.useCallback(() => {
      getData()
    }, [])
  );

  //updating local storage every time when fav array change
  useEffect(() => {
    storeData(favorites)
  }, [favorites])


  //honestly it is remove favorite because update collection when fav chanel revomed
  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (ids.includes(item.id)) {
      setFavorites(favorites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favorites)
    }
  }


  //store data to local storage and update view with refreser state
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

  //loading data from local storage
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
      <View style={styles.heading}>
        <Text style={{ color: 'black', fontWeight: 'bold' }}></Text>
      </View>
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
    marginLeft: 6,
    backgroundColor: '#f5eee7'
  },
});