import { useEffect, useState } from "react";
import { DarkModeContext } from "./DarkModeContext";

export const DarkModeContextProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(
        // Sets the darkMode to false if 'darkMode' not already stored in 'localStorage'
        // else, the previous value is retained. (theme stays same on reloads)
        JSON.parse(localStorage.getItem("darkMode")) || false
    );

    // Toggle theme modes (dark/light)
    const toggle = () => {
        setDarkMode(!darkMode);
    }

    // Set the mode(dark/light) in 'localStorage' whenever it changes.
    useEffect(()=> {
        localStorage.setItem("darkMode", darkMode)
    }, [darkMode])

    return(
        // Make 'darkMode' and 'toggle()' available everywhere inside
        <DarkModeContext.Provider value={{darkMode, toggle}}>
            {children}
        </DarkModeContext.Provider>
    )
};