import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

function Card(props) {

  function onPress(){
    console.log("CLICK")
  }

  return (
      <TouchableOpacity style ={styles.card} onPress={onPress}>
          <Image style= {styles.cardImage} source={{uri: props.item.image}}/> 
          <Text style={styles.cardText}>{props.item.name}</Text>
      </TouchableOpacity>
  
  );
}

export {Card}

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