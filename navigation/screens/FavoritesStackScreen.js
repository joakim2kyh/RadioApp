import * as React from 'react';
import { View, Text,} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesScreen } from './FavoritesScreen';
import { PlayScreen } from './PlayScreen' ;
import { HeaderBackButton } from '@react-navigation/elements';


const FavoritesStack = createNativeStackNavigator();

export default function FavoritesStackScreen({navigation}) {
    return (
        <FavoritesStack.Navigator>

          <FavoritesStack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{
          headerShown: false
        }} />
          <FavoritesStack.Screen name="PlayScreen" component={PlayScreen} options={{headerTitle: "", headerShown: true,
            headerTransparent: true, 


        }}/>
        </FavoritesStack.Navigator>
    );
}
