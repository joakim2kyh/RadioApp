import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default Card = (props) => {

  const [schedule, setSchedule] = useState([])
  const [live, setLive] = useState("")

  useEffect(() => {
    fetchSchedule(props.item.id)
})

const fetchSchedule = async (id) => {
  const uri = `http://api.sr.se/v2/scheduledepisodes?channelid=${id}&format=json&pagination=false`

  try {
    const response = await fetch(uri);
    let json = await response.json();
    setSchedule(json.schedule)
    const now = Date.now()
    
    schedule.forEach(element => {

      let startTime = element.starttimeutc
      startTime = startTime.slice(6, -2)
      let endTime = element.endtimeutc
      endTime = endTime.slice(6, -2)

      if(startTime < now && endTime > now){
        setLive(element.title)
      } else {
        //console.log("No Live Program") 
      }

    });
  } catch (error) {
    console.error(error);
  }
}

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
      <View style={[styles.cardContainer, {backgroundColor: '#'+props.item.color}]}>
        {/* <TouchableOpacity style ={styles.card} onPress={onPress}> */}
        <View style={styles.imgTextContainer}>
          <Image style={styles.cardImage} source={{ uri: props.item.image }} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.cardText} numberOfLines={1}>{props.item.name}</Text>
            <Text style={styles.programText} numberOfLines={1}>{live}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=> console.log(context)}>
          <AntDesign style={styles.play} name="play" size={45} color="black" />
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.heart} onPress={()=>props.addFavorite()}>
          <MaterialIcons name="favorite-outline" size={30} color="black" />
        </TouchableOpacity>
        
      </View>
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  imgTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    height: 100,
    width: 100,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    resizeMode: 'cover'
  },
  cardText: {
    padding: 1,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  programText: {
    fontSize: 12,
    fontWeight: '400'
  },
  play: {
    marginEnd: 10
  },
  infoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
  heart: {
   // alignSelf: 'flex-end'
   position: 'absolute',
   right: 5,
   bottom: 5
  }
});