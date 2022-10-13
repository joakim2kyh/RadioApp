import * as React from 'react';
import { View, Text } from 'react-native';

export default function FavouritesScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Favourites')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Favourites Screen</Text>
        </View>
    );
}