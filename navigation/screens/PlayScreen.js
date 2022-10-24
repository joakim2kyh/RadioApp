
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';


export function PlayScreen({ navigation, route }) {

   // const [isPlaying, setIsPlaying] = useState(false)
    const [schedule, setSchedule] = useState(route.params.schedule)
    const [live, setLive] = useState({})
    const [image, setImage] = useState("")
    const [refresh, setRefresh] = useState([true])


    useEffect(() => {
        //console.log(schedule)
        getLive()
    },[])


    const isPlaying = () => {
        if (global.soundHandler.channel.id == route.params.item.id && global.soundHandler.isPlaying){
          return "pausecircle"
        } else {
          return "play"
        }
      }

      async function loadSound(item) {
        await global.soundHandler.sound.unloadAsync()
          .then(global.soundHandler.channel = item,
            global.soundHandler.program = live)
          console.log("rad 34 url", item.liveaudio.url);
        await global.soundHandler.sound.loadAsync({ uri: item.liveaudio.url })
        await global.soundHandler.sound.playAsync()
      }

      const playRadio = (item) => {
        if (global.soundHandler.isPlaying && global.soundHandler.channel.id == item.id) {
          global.soundHandler.sound.pauseAsync()
          global.soundHandler.isPlaying = false
         console.log("42")
        } else {
          loadSound(item)
          global.soundHandler.isPlaying = true
         console.log("46");
        }
        setRefresh({
          refresh: !refresh
        })
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
            //setImage(element.imageurl)
          } else {
            //console.log("No Live Program") 
          }
      
        });
      }

    return (

        <View style={styles.container}>
           <Image style={styles.channelImage} source={{ uri: live.imageurl }}/>
          
            {/* <Text style={styles.tagline}>
                This is {route.params.item.tagline} </Text> */}
            <Text>
                { route.params.item.name }
            </Text>
            <Text>
                {live.title}
            </Text>

            <TouchableOpacity onPress={()=> playRadio(route.params.item)}>
                    
                {/* <AntDesign style={styles.play} name= { global.soundHandler.isPlaying && global.soundHandler.channel.id == route.params.item.id ? "pausecircle" : "play" } size={80} color="black" /> */}
                <AntDesign style={styles.play} name={isPlaying()} size={45} color="black" />
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    channelImage: {
        height: 250,
        width: 250,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
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

