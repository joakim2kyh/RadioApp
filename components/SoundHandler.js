import { Audio } from "expo-av";
import moment from "moment";

/**  
 * Handles loading, playing and pausing sound
 * Stores channel and program currently playing
 * */
export default class SoundHandler {

  sound = new Audio.Sound();
  isPlaying = false;
  channel = {};
  program = {};
  schedule = [];
  showMiniplayer = false;

  // Singleton
  constructor() {
    if (SoundHandler._instance) {
      return SoundHandler._instance
    }
    SoundHandler._instance = this;
  };

  /**
    * plays/pauses audio
    */
  playRadio(item = this.channel, live = this.program, schedule = this.schedule) {
    this.schedule = schedule
    if (this.isPlaying && this.channel.id == item.id) {
      console.log("PAUSE");
      this.isPlaying = false
      this.sound.pauseAsync()
    } else {
      console.log("PLAY");
      this.isPlaying = true
      this.showMiniplayer = true
      this.loadSound(item, live)
    }
  }

  /**
   * loads sound from url
   */
  async loadSound(item, live) {
    await this.sound.unloadAsync()
      .then(
        // Set channel and program currently playing
        this.channel = item,
        this.program = live,
      )
    await this.sound.loadAsync({ uri: item.liveaudio.url }).then(console.log("LOADED"))
    await this.sound.playAsync()
  }

  /**
   *  returns formated start and end time for program
   */ 
  getStartAndEndTime(program = this.program) {

    if (program.starttimeutc != null) {

      let startTime = program.starttimeutc
      startTime = startTime.slice(6, -2)
      let endTime = program.endtimeutc
      endTime = endTime.slice(6, -2)

      var startTimeUtc = new Date(parseInt(startTime))
      var endTimeUtc = new Date(parseInt(endTime))

      var startTimeFormat = moment(startTimeUtc).format("HH:mm");
      var endTimeFormat = moment(endTimeUtc).format("HH:mm");

      var timeFormat = startTimeFormat.toString() + " - " + endTimeFormat.toString()

      return timeFormat
    }

    return ""
  }
}