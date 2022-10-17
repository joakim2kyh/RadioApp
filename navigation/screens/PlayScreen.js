import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


export function PlayScreen({navigation, route}) {
    
    return (

        <View style={styles.container}>
           <Image style={styles.channelImage} source={{ uri: route.params.item.image }}/>
           <Text style={styles.textInfo}></Text>
           <Text>
                This is {route.params.item.name} </Text>
            <Text>
                This is {route.params.item.id} </Text>
            <Text>
                This is {route.params.item.tagline} </Text>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
        flex: 1
    },
    channelImage:{
        height: 100,
        width: 100,
        borderRadius: 12,
        padding: 15,
        margin: 5,
        resizeMode: 'cover'
    },
    textInfo:{
        
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

