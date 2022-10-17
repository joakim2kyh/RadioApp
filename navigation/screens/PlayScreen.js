import * as React from 'react';
import { View, Text } from 'react-native';

export function PlayScreen({navigation, route}) {
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>
                This is {route.params.name} </Text>
        </View>
    );
}