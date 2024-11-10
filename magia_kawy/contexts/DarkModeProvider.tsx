import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DarkModeContextType = {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);


    useEffect(() => {
        
        const loadDarkModePreference = async () => {
            const savedPreference = await AsyncStorage.getItem('darkMode');
            if (savedPreference !== null) {
                setIsDarkMode(JSON.parse(savedPreference));
            }
        };
        loadDarkModePreference();
    }, []);

    const toggleDarkMode = async () => {
        setIsDarkMode((prev) => {
            const newValue = !prev;
            AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};
