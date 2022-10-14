import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './HomeScreen';
import { PlayScreen } from './PlayScreen' 

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen({navigation}) {
    return (
        <HomeStack.Navigator>
          <HomeStack.Screen name="Home" component={HomeScreen} />
          <HomeStack.Screen name="Play" component={PlayScreen} />
        </HomeStack.Navigator>
    );
}
