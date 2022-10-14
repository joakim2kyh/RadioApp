import * as React from 'react';
import { View, Text } from 'react-native';

export function PlayScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Favourites')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Play Screen</Text>
        </View>
    );
}