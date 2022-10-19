import React, { useState, createContext } from 'react';
import { Audio } from "expo-av";

export const SoundContext = createContext(new Audio.Sound());

export const SoundProvider = ({ children }) => {
    const sound = new Audio.Sound()

    return(
        <SoundContext.Provider value={sound}>
            {children}
        </SoundContext.Provider>
    );
};
