import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CommonDataManager from './CommonDataManager';
import SoundHandler from './SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';

export default Card = (props) => {

  const soundManager = new SoundHandler()
  const [schedule, setSchedule] = useState([])
  const [live, setLive] = useState({})
  const TENSEC_MS = 10000;
  const ONESEC_MS = 1000;

  useEffect(() => {
    fetchSchedule(props.item.id)
  }, [])

  useEffect(() => {
    getLive()
  }, [schedule])

  useEffect(() => {
    const interval = setInterval(() => {
      getLive()
    }, ONESEC_MS);
    return () => clearInterval(interval);
  }, [schedule])

  const isFavorited = () => {
    let dataManager = CommonDataManager.getInstance()
    let ids = dataManager.getFavIDs()
    if (ids.includes(props.item.id)) {
      return "favorite"
    } else {
      return "favorite-outline"
    }
  }

  const fetchSchedule = async (id) => {
    const uri = `http://api.sr.se/v2/scheduledepisodes?channelid=${id}&format=json&pagination=false`

    try {
      const response = await fetch(uri);
      let json = await response.json();
      setSchedule(json.schedule)

    } catch (error) {
      console.error(error);
    }
  }

  const getLive = () => {
    var now = Date.now()

    schedule.forEach(element => {
      let startTime = element.starttimeutc
      startTime = Number(startTime.slice(6, -2))
      let endTime = element.endtimeutc
      endTime = Number(endTime.slice(6, -2))

      if (startTime < now && endTime > now) {
        setLive(element)
      } else {
      }
    });
  }

  const isPlaying = () => {
    if (soundManager.channel.id == props.item.id && soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
    }
  }

  return (
    <PressableScale onPress={() => props.onPress(schedule)}>
      <View style={[styles.cardContainer, { backgroundColor: '#' + props.item.color }]}>
        <View style={styles.imgTextContainer}>
          <Image style={styles.cardImage} source={{ uri: props.item.image }} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.cardText} numberOfLines={1}>{props.item.name}</Text>
            <Text style={styles.programText} numberOfLines={1}>{live.title}</Text>
            <Text>{soundManager.getStartAndEndTime(live)}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PressableScale onPress={() => { soundManager.schedule = schedule, props.playRadio(live) }}>
            <Fontisto style={styles.play} name={isPlaying()} size={25} color="black" />
          </PressableScale>
        </View>
        <PressableScale onPress={() => props.addFavorite()}>
          <MaterialIcons name={isFavorited()} size={30} color="black" />
        </PressableScale>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    marginHorizontal: 10,
    backgroundColor: '#219ebc',
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },

  imgTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: "15%"
  },

  cardImage: {
    height: 100,
    width: 100,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    resizeMode: 'cover'
  },

  cardText: {
    padding: 1,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  programText: {
    fontSize: 12,
    fontWeight: '400'
  },

  play: {
    marginEnd: 10,
  },

  infoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
});