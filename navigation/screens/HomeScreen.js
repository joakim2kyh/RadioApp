import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundContext, SoundProvider } from '../../SoundContext';
import { AntDesign } from '@expo/vector-icons';


//export const Context1 = React.createContext(new Audio.Sound());

export function HomeScreen({ navigation, component }) {

  const [channels, setChannels] = useState([])
  const [schedule, setSchedule] = useState([])
  const [favourites, setFavourites] = useState([])
  const [live, setLive] = useState("")
  //const sound = useState(new Audio.Sound());

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
    fetchList2()
    //console.info("effect " + favourites)
    storeData(favourites)
  }, [favourites])

  const fetchList2 = async () => {
    try {
      let response = await fetch("http://api.sr.se/api/v2/channels?format=json");
      let json = await response.json();
      setChannels(json.channels)
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
    <SoundProvider>
      <View style={styles.container}>
        

        <FlatList
          data={channels}
          
          renderItem={({ item }) => (
            <Card item={item} playRadio={() => playRadio()} addFavorite={() => addFavorite(item.id)} onPress={
              () => {
                
                navigation.navigate('PlayScreen', { item: item })
              }
              
            } />
          )}
        />
        <View>
          
          <View style={styles.bottomBar}>
          <View style={styles.channelContainer}>
            <Text style={styles.channel}>P1</Text>
            <Text style={styles.program}>Nu körs p1, ekot</Text>
            <TouchableOpacity style={styles.play} onPress={()=> console.log('hej he hej')}>
        <AntDesign style={styles.playss} name="play" size={35} color="black" />
        </TouchableOpacity>
          </View>

          
          </View>

        

         </View>
      </View>
    </SoundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 690,
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },
  bottomBar:{
    backgroundColor:'white',

    width: 400,
    height: 80,
   
  },
  left: {
    
  },
  channelContainer:{
    flexDirection:'row',
    justifyContent: 'space-between',
    

  },
  channel:{
    backgroundColor: 'red',
    height: 80,
    width: 80,
    flex:1

  },
  program:{
    backgroundColor:'green',
    height: 80,
    width:200,
    flex:3
    
    
  },
  play:{
    flex:1

  }
  
  
});