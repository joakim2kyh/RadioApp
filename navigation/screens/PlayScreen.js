
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, Fontisto, MaterialIcons } from '@expo/vector-icons';
import SoundHandler from '../../components/SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';
import { shadow } from 'react-native-paper';
import CommonDataManager from '../../components/CommonDataManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from 'react-native-progress/Bar';


export function PlayScreen({ navigation, route }) {

  let schedule = route.params.schedule
  const [live, setLive] = useState({})
  const [refresh, setRefresh] = useState([true])
  const soundManager = new SoundHandler()
  const [favorites, setFavorites] = useState([])


  var ids = []
  let dataManager = null

  useFocusEffect(
    React.useCallback(() => {
      getData()
      getLive()
      if (!soundManager.isPlaying || soundManager.channel.id != route.params.item.id) {
        soundManager.playRadio(route.params.item, live)
      }
    }, [])
  )

  useEffect(() => {
    soundManager.program = live
  }, [live])

  useEffect(() => {
    storeData(favorites)
  }, [favorites])

  const isPlaying = () => {
    if (soundManager.channel.id == route.params.item.id && soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
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

  const isFavorited = () => {
    dataManager = CommonDataManager.getInstance()
    ids = dataManager.getFavIDs()
    console.log("icon updated")
    if (ids.includes(route.params.item.id)) {
      return "favorite"
    } else {
      return "favorite-outline"
    }
  }

  const handleFav = (value) => {
    route.params.addFavorite(value)
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

  const getLive = () => {
    const now = Date.now()
    schedule.forEach(element => {
      let startTime = element.starttimeutc
      startTime = startTime.slice(6, -2)
      let endTime = element.endtimeutc
      endTime = endTime.slice(6, -2)

      if (startTime < now && endTime > now) {
        setLive(element)
      } else {
        //console.log("No Live Program") 
      }
    });
  }

  return (

    <View style={styles.container}>


      {/*<ImageBackground style={styles.channelImage} imageStyle={{ borderRadius: 20, borderColor: 'black', borderWidth: 3}} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} >
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <TouchableOpacity onPress={()=>addFavorite(route.params.item)}>
          <MaterialIcons style={styles.heart} name={isFavorited()} size={60} color="white" />
        </TouchableOpacity>
      </View>
      </ImageBackground>
  */}

      <Image style={styles.programImage} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} ></Image>
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Image style={styles.channelCover} source={{ uri: route.params.item.image }} />
          {/*<Text style={styles.headText}>
          {route.params.item.name}
        </Text>*/}

          <View style={styles.programContainer}>
            <Text style={styles.programDescripton}>
              {live.title}
            </Text>
            <Text style={styles.getTime}>{soundManager.getStartAndEndTime(live)}</Text>
          </View>

        </View>

        <Text style={styles.channelDescription} adjustsFontSizeToFit>{live.description}</Text>
      </View>




      
      <Text style={styles.programDescripton}>
        {live.title}
      </Text>
      <ProgressBar progress={0.5}/>

      <PressableScale onPress={() => { soundManager.playRadio(route.params.item, live), setRefresh({ refresh: !refresh }) }}>

        <Fontisto style={styles.play} name={isPlaying()} size={40} color="black" />
      </PressableScale>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5eee7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  heart: {
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4

  },
  programImage: {
    aspectRatio: 1,
    width: '50%',
    margin: 10,
    marginBottom: 20,


    //  height: '50%',
    //width: '90%',
    //resizeMode: 'cover'
  },
  programDescripton: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10


  },
  getTime: {
    marginLeft: 30
  },

  play: {
    paddingTop: 20
  },
  channelCover: {
    //   height: 80,
    //   width: 80,
    aspectRatio: 1,
    flex: 1,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1
    //resizeMode: 'cover'
  },
  channelDescription: {
    fontSize: 15,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
    padding: 15

  },
  infoContainer: {

  },
  programContainer: {
    flex: 4
  }


})

