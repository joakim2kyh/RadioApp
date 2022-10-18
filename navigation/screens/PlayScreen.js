
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useContext } from 'react';

import { Context1 } from './HomeScreen';


export function PlayScreen({ navigation, route }) {

    const sound = useContext(Context1)

    async function loadSound(uri) {

        await sound.unloadAsync()
        await sound.loadAsync({ uri: uri })
        await sound.playAsync()
    }

    return (

        <View style={styles.container}>
            <Image style={styles.channelImage} source={{ uri: route.params.item.image }} />

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
    channelImage: {
        height: 250,
        width: 250,
        borderRadius: 12,
        padding: 15,
        marginBottom: 100,
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

