
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
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
        return "pausecircle"
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
      <ImageBackground style={styles.channelImage} imageStyle={{ borderRadius: 20}} source={{ uri: live.imageurl == null ? route.params.item.image : live.imageurl }} 
      >
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <TouchableOpacity onPress={addFavorite()}>
          <MaterialIcons style={styles.heart} name={"favorite"} size={60} color="black" />
        </TouchableOpacity>
   </View>
      </ImageBackground>

      <View style={styles.rowConatainer}>
        <Image style={styles.channelCover} source={{ uri: route.params.item.image }}/>
        <Text style={styles.headText}>
          {route.params.item.name}
        </Text>

      </View>
      <Text style={styles.lineText}>
        {live.title}
      </Text>

      <PressableScale onPress={() => {soundManager.playRadio(route.params.item, live), setRefresh({refresh: !refresh})}}>

        <AntDesign style={styles.play} name={isPlaying()} size={90} color="black" />
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
        height: 250,
        width: 250,
        borderRadius: 15 ,
        padding: 15,
        marginBottom: 20,
       // resizeMode: 'cover'
    },
    headText: {
      fontSize: 30,
      fontWeight: 'bold'
    },
    lineText: {
      fontSize: 20
    },
    play: {
      margin: 20
    },
    channelCover:{
      height: 50,
      width: 50,
      borderRadius: 5,
      // padding: 10,
      marginEnd: 10,
      resizeMode: 'cover'
    },
    tagline: {
        color: 'black',
    },

    cardImage: {
        // width: '100%',
        height: 100,
        width: 100,
        borderRadius: 12,
        padding: 15,
        margin: 5,
        resizeMode: 'cover'
    },
})

