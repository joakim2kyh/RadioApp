
import { View, Text, StyleSheet, Image, Button,TouchableOpacity } from 'react-native';
import { Audio } from "expo-av";
import React, {useState, useEffect} from 'react';


export function PlayScreen({navigation, route}) {

    const sound = route.params.sound
    const [isPlaying, setPlaying] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [live, setLive] = useState("")

    useEffect(() => {
        fetchSchedule(route.params.item.id)
    })

    async function loadSound(uri) {

        try {
            if(isPlaying){
                await sound.pauseAsync()
                setPlaying(false)
                console.log("inne i if satsen")
            
            }
            else{
                setPlaying(true)
                await sound.loadAsync(uri)
                await sound.playAsync()
                console.log("inne i else satsen")
                
            }
        }
        catch(error){
            console.log(error)

        }

        
        //await sound.loadAsync({
           // uri: uri
        //})
       
    }

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


    async function playSound() {
       
        await sound.playAsync()
        
    }

    async function pause() {
        await sound.pauseAsync()
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
            <TouchableOpacity>
           
            </TouchableOpacity>
                <Button title='PLAY' onPress={() => loadSound(route.params.item.liveaudio.url)}></Button>
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
    channelImage:{
        height: 250,
        width: 250,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        resizeMode: 'cover'
        
    },
    tagline:{
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

