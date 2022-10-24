import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import MainContainer from '../navigation/MainContainer';
import moment from 'moment';

export default function MiniPlayer(){


function getStartAndEndTime(){
  
    if (global.soundHandler.program.starttimeutc != null) {

      let startTime = global.soundHandler.program.starttimeutc
      startTime = startTime.slice(6, -2)
      let endTime = global.soundHandler.program.endtimeutc
      endTime = endTime.slice(6, -2)
      //console.log(endTime);

      var startTimeUtc = new Date(parseInt(startTime))
      var endTimeUtc = new Date(parseInt(endTime))

      var startTimeFormat = moment(startTimeUtc).format("HH:mm");
      var endTimeFormat = moment(endTimeUtc).format("HH:mm");

      var timeFormat = startTimeFormat.toString() + " - " + endTimeFormat.toString()

      return timeFormat
    }

   return " u did it"
}


  return(
    <View style={styles.bottomBar}>
            <View style={styles.channelContainer}>
             
              <Image style={styles.channelImage} source= {{uri: global.soundHandler.channel.image}}/>
              <View style={styles.programContainer}>
              <Text style={styles.programTitle}>{global.soundHandler.program.title}</Text>
              <Text style={styles.programTime}>{getStartAndEndTime()}</Text>
              </View>
              <TouchableOpacity style={styles.play} onPress={() => console.log('hej hej hej')}>
                <AntDesign style={styles.playss} name="play" size={35} color="black" />
              </TouchableOpacity>
            </View>
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '92%',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },

  bottomBar: {
    backgroundColor: 'white',

    // width: '100%',
    height: '8%'
  },
  
  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80
  },
  
  channelImage: {
    height: 80,
    width: 80,
    resizeMode: 'cover',
    flex: 1
  },

  programContainer: {
    backgroundColor: 'black',
    color: 'white'

  },
  
  programTitle: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    height: '50%',
    width: 200,
    flex: 3

  },
  
  programTime: {
    color: 'white',
    height: '50%',

  },

  play: {
    flex: 1

  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'

  },
  button: {
    margin: 4

  },
  text: {
   // color: 'tomato'
  }
});