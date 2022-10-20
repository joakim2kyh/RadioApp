
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';


export function PlayScreen({ navigation, route }) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [live, setLive] = useState("")

    useEffect(() => {
        fetchSchedule(route.params.item.id)
    })

    const fetchSchedule = async (id) => {
        const uri = `http://api.sr.se/v2/scheduledepisodes?channelid=${id}&format=json&pagination=false`

        try {
            const response = await fetch(uri);
            let json = await response.json();
           // let data = await Promise.all(json.)
            setSchedule(json.schedule)
            const now = Date.now()

            // schedule.forEach(element => {

            // for await (const element of schedule) {
            //     let startTime = element.starttimeutc
            //     startTime = startTime.slice(6, -2)
            //     let endTime = element.endtimeutc
            //     endTime = endTime.slice(6, -2)

            //     if (startTime < now && endTime > now) {
            //         // console.log(element.title)
            //         // console.log(live)
            //         setLive(element)
            //     } else {
            //         //console.log("NOPE") 
            //     }

            // };
        } catch (error) {
            console.error(error);
        }
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
                {live.name}
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

