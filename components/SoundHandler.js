import { Audio } from "expo-av";

export default class SoundHandler {
  
    sound = new Audio.Sound();
    isPlaying = false;
    channel = {};
    program = {};

    constructor() {
        if (SoundHandler._instance) {
          return SoundHandler._instance
        }
        SoundHandler._instance = this;
        console.log("SoundHandler created");
        // ... your rest of the constructor code goes after this
      };

      playRadio(item, live) {
        //console.log("item", item);
        if (this.isPlaying && this.channel.id == item.id) {
          console.log("PAUSE");
          this.isPlaying = false
          this.sound.pauseAsync()
          //this.isPlaying = false
        } else {
          console.log("PLAY");
          this.isPlaying = true
          this.loadSound(item, live)
          //this.isPlaying = true
        }
        // setRefresh({
        //   refresh: !refresh
        // })
      }

      async loadSound(item, live) {
        await this.sound.unloadAsync()
          .then(
            this.channel = item,
            this.program = live,
            //console.log(live)
            )
        await this.sound.loadAsync({ uri: item.liveaudio.url }).then(console.log("LOADED"))
        await this.sound.playAsync()
      }
}