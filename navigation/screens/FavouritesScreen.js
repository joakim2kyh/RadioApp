import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';


export default function FavouritesScreen({ navigation }) {

  const [favourites, setFavourites] = useState([])
  const [channels, setChannels] = useState([])
  const DATA = []

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');
      
      getData()
        .then(console.info("fav " + favourites))

    }, [favourites])
  );

  useEffect(() => {
    
    
}, [channels])

  const fetchStation = async () => {
    try {
      
      let res = JSON.parse(favourites)
      const arr = []; 

      res.forEach(async id => {
        let response = await fetch(`http://api.sr.se/api/v2/channels/${id}?format=json`);
        let json = await response.json();
        arr.push(json.channel)
        console.log("arr " + DATA)
        setChannels(arr)
        // setChannels((channels) => ([...channels, json.channel]));
      });
      // console.log("arr " + DATA)
      // setChannels([...channels, ...arr])
      console.log(channels)

      // setChannels([...channels, json.channel])
      
      // console.info("id "+json.channel)
      // console.log(cha)
    } catch (error) {
      console.error(error);
    }
  }


  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('idArray');
      setFavourites(jsonValue);
      let res = JSON.parse(jsonValue)
      console.log("res "+ res)

      fetchStation()
      // await res.forEach(id => {
      //   fetchStation(id)
      // });
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
    {/* <Button title='Fetch list' onPress={fetchList2}></Button>

  <Text>Open up App.js to start working on your app!</Text> */}
  
  {/* <Button title='Fetch live' onPress={fetchSchedule}></Button>
  <Text>{live}</Text> */}

  <FlatList
      data={channels} 
      extraData={channels}
      renderItem={({ item }) => (
        <Card item={item} />
      )}
      /> 
</View>
  );
}

const styles = StyleSheet.create({
  container: {
   // flex: 1,
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  //  padding: 20,
  },
  // item: {
  //   marginTop: 24,
  //   padding: 30,
  //   backgroundColor: "pink",
  // }

});