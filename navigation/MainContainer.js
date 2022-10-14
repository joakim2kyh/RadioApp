import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import { View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList} from 'react-native';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

import HomeStackScreen from './screens/HomeStackScreen';
import FavouritesScreen from './screens/FavouritesScreen';

const homeName = "HomeStack";
const favouritesName = "Favourites"

const Tab = createBottomTabNavigator();

export default function MainContainer() {

    
    return (
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions= {({route}) => ({
                tabBarInactiveTintColor: 'grey',
                tabBarActiveTintColor: 'tomato',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10},
                tabBarStyle: { padding: 10, height:70 },
                
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === favouritesName) {
                        iconName = focused ? 'heart' : 'heart-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },

            })}
            // screenOptions={{
            //     activeTintColor: 'tomato',
            //     inactiveTintColor: 'grey',
            //     labelStyle: { paddingBottom: 10, fontSize: 10},
            //     style: { padding: 10, height: 70 }
            // }}
            
            >
                <Tab.Screen name={homeName} component={HomeStackScreen} options={{
          headerShown: false,
        }}/>
                <Tab.Screen name={favouritesName} component={FavouritesScreen} options={{
          headerShown: false,
        }}/>

            </Tab.Navigator>
        </NavigationContainer>

    )
}

