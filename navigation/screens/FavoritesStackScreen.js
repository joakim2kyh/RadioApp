import * as React from 'react';
import { View, Text,} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesScreen }
import { PlayScreen } from './PlayScreen' ;
import { HeaderBackButton } from '@react-navigation/elements';


const FavoritesStack = createNativeStackNavigator();

export default function HomeStackScreen({navigation}) {
    return (
        <HomeStack.Navigator>

          <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{
          headerShown: false
        }} />
          <HomeStack.Screen name="PlayScreen" component={PlayScreen} options={{headerTitle: "", headerShown: true,
            headerTransparent: true, 


        }}/>
        </HomeStack.Navigator>
    );
}
