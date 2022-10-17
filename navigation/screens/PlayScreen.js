import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export function PlayScreen({navigation, route}) {
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image style={styles.cardImage} source={{ uri: route.params.item.image }} />
            <Text> This is {route.params.item.name} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardImage: {
    // width: '100%',
    height: 100,
    width: 100,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    resizeMode: 'cover'

  },

});