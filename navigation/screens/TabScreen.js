import * as React from 'react';
import { HomeScreen } from './HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavoritesScreen } from './FavoritesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

const homeName = "Alla kanaler";
const favoritesName = "Favoriter"

export default function TabScreen({ navigation }) {
  return (
    // Tab UI
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor: 'grey',
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: { paddingBottom: 10, paddingTop: 0, fontSize: 10 },
        tabBarStyle: { height: '8%'},

        // Icon UI
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline'
          } else if (rn === favoritesName) {
            iconName = focused ? 'heart' : 'heart-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })} >

      {/* HomeScreen tab */}
      <Tab.Screen name={homeName} component={HomeScreen} options={{
        headerShown: false,
      }} />

      {/* FavoritesScreen tab */}
      <Tab.Screen name={favoritesName} component={FavoritesScreen} options={{
        headerShown: false,
      }} />
      
    </Tab.Navigator>
  );
}


