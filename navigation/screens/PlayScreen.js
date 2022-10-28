
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import SoundHandler from '../../components/SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';
import CommonDataManager from '../../components/CommonDataManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from 'react-native-progress/Bar';

export function PlayScreen({ route }) {

  const soundManager = new SoundHandler()
  let schedule = route.params.schedule
  const [live, setLive] = useState({})
  const [refresh, setRefresh] = useState([true])
  const [favorites, setFavorites] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const TENSEC_MS = 10000;
  const ONESEC_MS = 1000;

  var ids = []
  let dataManager = null

  // Fetch favorites data from internal storage on appear
  useFocusEffect(
    React.useCallback(() => {
      getData()
      getLive()
      if (!soundManager.isPlaying || soundManager.channel.id != route.params.item.id) {
        soundManager.playRadio(route.params.item, live)
      }
    }, [])
  )

  // Set current program in sound manager class on change of current program
  useEffect(() => {
    soundManager.program = live
  }, [live])

  // Update internal storage on change of favorites list
  useEffect(() => {
    storeData(favorites)
  }, [favorites])

  // Update current program every ten seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getLive()
    }, TENSEC_MS);
    return () => clearInterval(interval);
  }, [])

  // Update 'timeElapsed' every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(live).length != 0) {
        getProgress()
      }
    }, ONESEC_MS);
    return () => clearInterval(interval);
  }, [live])

  /**
     * checks if audio is playing, returns correct icon name for play/pause button
     */
  const isPlaying = () => {
    if (soundManager.channel.id == route.params.item.id && soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
    }
  }

  /**
     * sets 'timeElapsed' variable based on the number of seconds from current program's start time
     */
  const getProgress = () => {
    let totalLengthInSeconds = (Number(live.endtimeutc.slice(6, -2)) - Number(live.starttimeutc.slice(6, -2)))
    let timeElapsedInSeconds = Date.now() - Number(live.starttimeutc.slice(6, -2))
    let progress = timeElapsedInSeconds / totalLengthInSeconds
    setTimeElapsed(progress)
  }

  /**
     * adds/removes current item to/from favorites list when user clicks favorite button
     */
  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (!ids.includes(item.id)) {
      setFavorites([...favorites, item])
    } else {
      setFavorites(favorites.filter(e => e.id != item.id))
    }
  }

  /**
     * checks if current item is favorited, returns correct icon name
     */
  const isFavorited = () => {
    dataManager = CommonDataManager.getInstance()
    ids = dataManager.getFavIDs()
    if (ids.includes(route.params.item.id)) {
      return "favorite"
    } else {
      return "favorite-outline"
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
     * sets 'live' variable from current program in schedule
     */
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
      }
    });
  }

  return (

    <View style={styles.container}>
      {/* Favorite button */}
      <View style={styles.heartContainer}>
        <TouchableOpacity onPress={() => addFavorite(route.params.item)}>
          <MaterialIcons style={styles.heart} name={isFavorited()} size={35} color="black" />
        </TouchableOpacity>
      </View>

      {/* Program image */}
      <View style={styles.imgContainer}>
        <Image style={styles.programImage} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} ></Image>
      </View>

      {/* Program information */}
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Image style={styles.channelCover} source={{ uri: route.params.item.image }} />
          <View style={styles.programContainer}>
            <Text style={styles.programTitle} numberOfLines={2} adjustsFontSizeToFit={true}>{live.title == undefined ? soundManager.channel.name : live.title}</Text>
            <Text style={styles.getTime}>{soundManager.getStartAndEndTime(live)}</Text>
            <ProgressBar progress={timeElapsed} width={null} color={'black'} style={styles.progressBar} />
          </View>
        </View>
        <Text style={styles.programDescription} numberOfLines={5}>{live.description}</Text>
      </View>

      {/* Play/pause button */}
      <View style={styles.playContainer}>
        <PressableScale onPress={() => { soundManager.playRadio(route.params.item, live), setRefresh({ refresh: !refresh }) }}>
          <Fontisto style={styles.play} name={isPlaying()} size={40} color="black" />
        </PressableScale>
      </View>
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

  heartContainer: {
    position: 'absolute',
    top: 38,
    right: 10,
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

  imgContainer: {
    flex: 4,
    marginTop: '20%',
  },

  programImage: {
    aspectRatio: 1,
    width: '100%',
    marginBottom: 50,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
  },

  infoContainer: {
    width: '90%',
    marginHorizontal: 5,
    height: '20%',
    flex: 2
  },

  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: 0,
  },

  channelCover: {
    flex: 1.5,
    aspectRatio: 1,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 5,
  },

  programContainer: {
    flex: 4.5,
    marginLeft: 10,
    padding: 5,
    paddingTop: 0,
  },

  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  getTime: {
    fontSize: 14,
    fontWeight: '600',
  },

  progressBar: {
    marginTop: 5,
  },

  playContainer: {
    flex: 1
  },

  programDescription: {
    fontSize: 14,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 15
  },
})