import { Audio } from "expo-av";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayScreen } from './screens/PlayScreen';
import TabScreen from './screens/TabScreen';

const Stack = createNativeStackNavigator();

export default function MainContainer() {

    global.soundHandler = {
        sound: new Audio.Sound(),
        isPlaying: false,
        channel: {},
        program: {}
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="TabScreen" component={TabScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="PlayScreen" component={PlayScreen} options={{
                    headerTitle: "", headerShown: true,
                    headerTransparent: true,
                }} />
            </Stack.Navigator>
        </NavigationContainer>

    )
}

