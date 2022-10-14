import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";


export default class Card extends React.PureComponent {
  render() {

  

return (
     <TouchableOpacity style ={styles.card}>
        <Image style= {styles.cardImage} source={{uri:'https://pbs.twimg.com/profile_images/2848282725/40daf57852e656d1c705b2cb769e5fdf_400x400.jpeg'}}/> 
        <Text style={styles.cardText}>Card title</Text>
     </TouchableOpacity>
  
);
}
}

const styles = StyleSheet.create({

 // item: {
  //  marginTop: 24,
   // padding: 30,
   // backgroundColor: "pink",
 // },
  card: {
    backgroundColor: '#50A0B7',
    marginBottom: 20,
    marginLeft: '2%',
    width: '96%',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 9,
    shadowOffset: {
    width:3,
      height:3
    }
   
  },
  cardImage:{
    width: '100%',
    height:200,
    resizeMode: 'cover'

  },
  cardText:{
    padding: 10,
    fontSize: 20

  }
});