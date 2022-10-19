import React, { useState, createContext } from 'react';
import { Audio } from "expo-av";

const SoundContext = createContext();

const SoundProvider = ({ children }) => {
    const sound = useState(new Audio.Sound());

    return(
        <SoundContext.Provider value={sound}>
            {children}
        </SoundContext.Provider>
    );
};

export {SoundContext, SoundProvider}