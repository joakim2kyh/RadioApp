
import { View, Text, StyleSheet, Image, Button,TouchableOpacity } from 'react-native';
import { Audio } from "expo-av";
import React, {useState} from 'react';


export function PlayScreen({navigation, route}) {

    const sound = route.params.sound
    const [isPlaying, setPlaying] = useState(false)

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


    async function playSound() {
       
        await sound.playAsync()
        
    }

    async function pause() {
        await sound.pauseAsync()
    }
    
    return (

        <View style={styles.container}>
           <Image style={styles.channelImage} source={{ uri: route.params.item.image }}/>
          
            <Text style={styles.tagline}>
                This is {route.params.item.tagline} </Text>
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
        marginBottom: 100,
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

