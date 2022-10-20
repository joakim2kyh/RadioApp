import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';


export default function FavouritesScreen({ navigation }) {

  const [favourites, setFavourites] = useState([])
  const [refresh, setRefresh] = useState([true])

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');
      
      getData()
        // .then(console.info("fav " + favourites))

    }, [])
  );

  useEffect(()=>{
    storeData(favourites)
  },[favourites])


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

  const playRadio = () => {
    
  }

  const addFavorite = (item) => {
    let ids = favourites.map(o => o.id)
    if (ids.includes(item.id)) {
      setFavourites(favourites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favourites)
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
      setFavourites(json);
      console.info("json " + json)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
  <FlatList
      data={
        favourites
      } 
      extraData = {refresh}
      renderItem={({ item }) => (
        <Card item={item} playRadio={() => playRadio()} addFavorite={() => addFavorite(item)} />
      )}
      /> 
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },
});