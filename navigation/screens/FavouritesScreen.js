import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';


export default function FavouritesScreen({navigation}) {

    useEffect(() => {
        getData()
        console.info("getData complete")
        console.info(getData())
    }, [])

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('idArray')
          console.info("favourites = " + JSON.parse(jsonValue))
          return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch(e) {
          console.log(e)
        }
      }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Favourites')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Favourites Screen</Text>
        </View>
    );
}