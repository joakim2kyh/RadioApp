
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
import { color } from 'react-native-reanimated';


export function PlayScreen({ navigation, route }) {

  let schedule = route.params.schedule
  const [live, setLive] = useState({})
  const [refresh, setRefresh] = useState([true])
  const soundManager = new SoundHandler()
  const [favorites, setFavorites] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const TENSEC_MS = 10000;
  const ONESEC_MS = 1000;

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

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('Logs every 10sec ');
      getLive()
    }, TENSEC_MS);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('Logs every 2sec ');
      if (Object.keys(live).length != 0) {
        getProgress()
      }
    }, ONESEC_MS);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [live])

  const isPlaying = () => {
    if (soundManager.channel.id == route.params.item.id && soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
    }
  }

  const getProgress = () => {
    let totalLengthInSeconds = (Number(live.endtimeutc.slice(6, -2)) - Number(live.starttimeutc.slice(6, -2)) )
    let timeElapsedInSeconds = Date.now() - Number(live.starttimeutc.slice(6, -2)) 
    let progress = timeElapsedInSeconds/totalLengthInSeconds
    console.log("time elapsed: ", timeElapsedInSeconds);
    console.log("progress: ", progress);
    setTimeElapsed(progress)
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
    //console.log("icon updated")
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
      <View style={{ position: 'absolute', top: 10, right: 10 }}>
        <TouchableOpacity onPress={() => addFavorite(route.params.item)}>
          <MaterialIcons style={styles.heart} name={isFavorited()} size={40} color="black" />
        </TouchableOpacity>
      </View>
      <Image style={styles.programImage} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} ></Image>
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Image style={styles.channelCover} source={{ uri: route.params.item.image }} />
          <View style={styles.programContainer}>
            <Text style={styles.programTitle}>{live.title}</Text>
            <Text style={styles.getTime}>{soundManager.getStartAndEndTime(live)}</Text>
            <ProgressBar progress={timeElapsed} width={null} color={'black'} style={styles.progressBar} />
          </View>
        </View>
        <Text style={styles.programDescription} >{live.description}</Text>
      </View>

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
    padding: 50
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
  },
  programImage: {
    aspectRatio: 1,
    width: '100%',
    marginBottom: 50,
    borderRadius: 20
  },
  programTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  getTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    marginTop: 5
  },
  play: {
    marginTop: 20
  },
  channelCover: {
    flex: 1.5,
    aspectRatio: 1,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 5
  },
  programDescription: {
    fontSize: 14,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    // fontStyle: 'italic',
    marginVertical: 15,
    marginHorizontal: 15
  },
  infoContainer: {
    marginHorizontal: 20,
  },
  programContainer: {
    flex: 4.5,
    marginLeft: 5,
    padding: 5,
    paddingTop: 0,
  }
})

