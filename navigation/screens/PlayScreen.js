
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign,Fontisto, MaterialIcons } from '@expo/vector-icons';
import SoundHandler from '../../components/SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';


export function PlayScreen({ navigation, route }) {

    let schedule = route.params.schedule
    const [live, setLive] = useState({})
    const [refresh, setRefresh] = useState([true])
    const soundManager = new SoundHandler()

    useEffect(() => {
        getLive()
        if (!soundManager.isPlaying || soundManager.channel.id != route.params.item.id ) {
            soundManager.playRadio(route.params.item, live)
        }
    },[])

    useEffect(() => {
      soundManager.program = live
    }, [live])

    const isPlaying = () => {
      if (soundManager.channel.id == route.params.item.id && soundManager.isPlaying){
        return "pause"
      } else {
        return "play"
      }
    }

      const addFavorite = () => {
        console.log("pressed favorite")
      }

    const getLive = () => {
        const now = Date.now()
        schedule.forEach(element => {
          let startTime = element.starttimeutc
          startTime = startTime.slice(6, -2)
          let endTime = element.endtimeutc
          endTime = endTime.slice(6, -2)
      
          if(startTime < now && endTime > now){
            setLive(element)
          } else {
            //console.log("No Live Program") 
          }
        });
      }

  return (

    <View style={styles.container}>
<View style={styles.rowConatainer}>
        <Image style={styles.channelCover} source={{ uri: route.params.item.image }}/>
        {/*<Text style={styles.headText}>
          {route.params.item.name}
        </Text>*/}
        
      </View>
      <View>
      <Text style={styles.channelDescription}>{live.description}</Text>
      </View>
      <ImageBackground style={styles.channelImage} imageStyle={{ borderRadius: 20, borderColor: 'black', borderWidth: 3}} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} >
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <TouchableOpacity onPress={addFavorite()}>
          <MaterialIcons style={styles.heart} name={"favorite"} size={60} color="black" />
        </TouchableOpacity>
      </View>
      </ImageBackground>

      
      <Text style={styles.programDescripton}>
        {live.title}
      </Text>

      <PressableScale onPress={() => {soundManager.playRadio(route.params.item, live), setRefresh({refresh: !refresh})}}>

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
        alignItems: 'center'
    },
    heart: {
      margin: 10
    },
    rowConatainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15
      // flex: 1,
    },
    channelImage: {
        height: 300,
        width: 300,
        borderRadius: 15 ,
        padding: 40
        //resizeMode: 'cover'
    },
    programDescripton: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 20

    },
    play: {
    },
    channelCover:{
      height: 80,
      width: 80,
      borderRadius: 5,
      marginBottom: 20,
      borderColor: 'black',
      borderWidth: 1
      //resizeMode: 'cover'
    },
    channelDescription:{
      fontSize: 15,
      color: 'black',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: 20

    },
  
})

