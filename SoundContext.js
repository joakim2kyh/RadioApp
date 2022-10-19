import React, { useState, createContext } from 'react';
import { Audio } from "expo-av";

<<<<<<< Updated upstream
const SoundContext = createContext(new Audio.Sound());

const SoundProvider = ({ children }) => {
    const sound = useState(new Audio.Sound());

    return(
        <SoundContext.Provider value={sound}>
=======
export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [soundDetails, setSoundDetails] = useState({
        sound: new Audio.Sound(), 
        isPlaying: false
    });
    //const sound = new Audio.Sound()
    //const [isPlaying, setIsPlaying] = useState(false)

    return(
        <SoundContext.Provider value={{soundDetails}}>
>>>>>>> Stashed changes
            {children}
        </SoundContext.Provider>
    );
};
