import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import SoundHandler from './SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';
import { Fontisto } from '@expo/vector-icons';

export default function MiniPlayer(props) {

  const soundManager = new SoundHandler()
  const [refresh, setRefresh] = useState([true])
  const [live, setLive] = useState(soundManager.program)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const ONESEC_MS = 1000;
  const TENSEC_MS = 10000;

  // Get current live program when Miniplayer first runs
  useEffect(() => {
    getLive()
  }, [])

  // Updates current program every second
  useEffect(() => {
    const interval = setInterval(() => {
      getLive()
    }, ONESEC_MS);
    return () => clearInterval(interval);
  }, [])

  /**
     * checks if audio is playing, returns correct icon name for play/pause button
     */
  const isPlaying = () => {
    if (soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
    }
  }

  /**
     * sets 'live' variable from current program in schedule
     */
  const getLive = () => {
    var now = Date.now()
    soundManager.schedule.forEach(element => {
      let startTime = element.starttimeutc
      startTime = Number(startTime.slice(6, -2))
      let endTime = element.endtimeutc
      endTime = Number(endTime.slice(6, -2))

      if (startTime < now && endTime > now) {
        soundManager.program = element
        setLive(element)
      } else {
      }
    });
  }

  return (
    <Pressable onPress={() => props.onPress(soundManager.schedule)}>
      <View style={styles.container}>
        <View style={styles.channelContainer}>

          {/* Channel Image */}
          <Image style={styles.channelImage} source={{ uri: soundManager.channel.image }} />
         
          {/* Program info */}
          <View style={styles.programContainer}>
            <Text style={styles.programTitle} numberOfLines={1}>
              {soundManager.program.title === undefined ? soundManager.channel.name : soundManager.program.title}
              </Text>
            <Text style={styles.programTime}>{soundManager.getStartAndEndTime()}</Text>
          </View>
         
          {/* Play button */}
          <PressableScale style={styles.play} onPress={() => { soundManager.playRadio(), setRefresh({ refresh: !refresh }), props.setRefreshList(!props.refreshList) }}>
            <Fontisto name={isPlaying()} size={30} color="white" />
          </PressableScale>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '14%',
  },

  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    padding: 10
  },

  channelImage: {
    height: 80,
    width: 80,
    resizeMode: 'cover',
    flex: 1,
    borderRadius: 10
  },

  programContainer: {
    padding: 5,
    paddingLeft: 10
  },

  programTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    height: '50%',
    width: 200,
    flex: 3,
  },

  programTime: {
    color: 'white',
    height: '50%',
  },

  play: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});