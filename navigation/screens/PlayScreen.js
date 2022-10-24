
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';


export function PlayScreen({ navigation, route }) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [schedule, setSchedule] = useState(route.params.schedule)
    const [live, setLive] = useState({})
    const [image, setImage] = useState("")

    useEffect(() => {
        //console.log(schedule)
        getLive()
    },[])


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

    async function loadSound(uri) {
        await global.soundHandler.sound.unloadAsync()
        global.soundHandler.channel = route.params.item
        await global.soundHandler.sound.loadAsync({ uri: uri })
        await global.soundHandler.sound.playAsync()
        console.log(global.soundHandler.channel)
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

            <TouchableOpacity onPress={() => {
                console.log('isPlaying 81', global.soundHandler.isPlaying)
                if (global.soundHandler.isPlaying && global.soundHandler.channel.id == route.params.item.id) {
                    global.soundHandler.sound.pauseAsync()
                    global.soundHandler.isPlaying = false
                } else {
                    loadSound(route.params.item.liveaudio.url)
                    global.soundHandler.isPlaying = true
                }
                
                console.log('isPlaying 90',global.soundHandler.isPlaying) }}>
                <AntDesign style={styles.play} name= { global.soundHandler.isPlaying && global.soundHandler.channel.id == route.params.item.id ? "pausecircle" : "play" } size={80} color="black" />
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

