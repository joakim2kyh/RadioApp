import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SoundHandler from './SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';
import { Fontisto } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';

export default function MiniPlayer(props) {

  const soundManager = new SoundHandler()
  const [refresh, setRefresh] = useState([true])
  const [schedule, setSchedule] = useState(soundManager.schedule)
  const [live, setLive] = useState(soundManager.program)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const ONESEC_MS = 1000;
  const TENSEC_MS = 10000;

  useEffect(() => {
    getLive()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(live).length != 0) {
        getProgress()
      }
    }, ONESEC_MS);
    return () => clearInterval(interval);
  }, [live])

  useEffect(() => {
    const interval = setInterval(() => {
        getLive()
      
    }, ONESEC_MS);
    return () => clearInterval(interval); 
  }, [schedule])

  const isPlaying = () => {
    if (
      soundManager.isPlaying) {
      return "pause"
    } else {
      return "play"
    }
  }

  const getProgress = () => {
    let totalLengthInSeconds = (Number(live.endtimeutc.slice(6, -2)) - Number(live.starttimeutc.slice(6, -2)) )
    let timeElapsedInSeconds = Date.now() - Number(live.starttimeutc.slice(6, -2)) 
    let progress = timeElapsedInSeconds/totalLengthInSeconds
    setTimeElapsed(progress)
  }

  const getLive = () => {
    var now = Date.now()
    //console.log("schedule: ", schedule);
    schedule.forEach(element => {
      let startTime = element.starttimeutc
      startTime = Number(startTime.slice(6, -2))
      let endTime = element.endtimeutc
      endTime = Number(endTime.slice(6, -2))

      if (startTime < now && endTime > now) {
          //soundManager.program = element
          setLive(element)
      } else {
      }
    });
  }

  return (
    <Pressable onPress={() => props.onPress(schedule)}>
      <View style={styles.bottomBar}>
        <View style={styles.channelContainer}>
          <Image style={styles.channelImage} source={{ uri: soundManager.channel.image }} />
          <View style={styles.programContainer}>
            <Text style={styles.programTitle}>{soundManager.program.title}</Text>
            <Text style={styles.programTime}>{soundManager.getStartAndEndTime()}</Text>
            <ProgressBar progress={timeElapsed} width={null} color={'white'} style={styles.progressBar} />
          </View>
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
    height: '92%',
    marginTop: 50,
    backgroundColor: 'black'
  },

  bottomBar: {
    backgroundColor: 'black',
    // width: '100%',
    height: '14%'

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
    backgroundColor: 'black',
    color: 'white',
    padding: 5,
    paddingLeft: 10
  },

  programTitle: {
    backgroundColor: 'black',
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

  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  button: {
    margin: 4
  },
});