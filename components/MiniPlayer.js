import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
export default function MiniPlayer(){





  return(
    <View style={styles.bottomBar}>
            <View style={styles.channelContainer}>
             
              <Text style={styles.channelImage}>P1</Text>
              <View style={styles.programContainer}>
              <Text style={styles.programTitle}>Klassisk förmiddag</Text>
              <Text style={styles.programTime}>11.11-12.09</Text>
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
    backgroundColor: 'blue',
    color:'white',
    width: 80,
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