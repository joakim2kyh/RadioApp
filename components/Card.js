import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default Card = (props) => {

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
      <View style={[styles.cardContainer, {backgroundColor: '#'+props.item.color}]}>
        {/* <TouchableOpacity style ={styles.card} onPress={onPress}> */}
        <Image style={styles.cardImage} source={{ uri: props.item.image }} />
        <Text style={styles.cardText}>{props.item.name}</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=>props.playRadio()}>
          <AntDesign style={styles.play} name="play" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.addFavorite()}>
          <MaterialIcons name="favorite-outline" size={30} color="black" />
        </TouchableOpacity>
        </View>
      </View>
    </View>
    </TouchableOpacity>
    
  );
}

// export { Card }

const styles = StyleSheet.create({

  // item: {
  //  marginTop: 24,
  // padding: 30,
  // backgroundColor: "pink",
  // },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#219ebc',
    marginBottom: 20,
    shadowColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
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
      width: 3,
      height: 3
    }
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    // width: '100%',
    height: 100,
    width: 100,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    resizeMode: 'cover'

  },
  cardText: {
    padding: 10,
    fontSize: 20,
    alignItems: 'center',
  },
  play: {
    marginEnd: 10
  }
});