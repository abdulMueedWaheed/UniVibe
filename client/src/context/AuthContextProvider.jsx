import { useEffect, useState } from "react";
import {AuthContext} from "./AuthContext"


export const AuthContextProvider = ({children}) => {

    // Current User is an Object (Contains user info - name, profile-pic etc...)
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = () => {
        // TO DO
        setCurrentUser({
            id: 1,
            name: 'Abdullah Asim',
            profilePic: "https://i.pinimg.com/736x/83/38/1b/83381b20d67747ed8c8d0d4afac89f37.jpg"
        });
    }

    // Set Current User info in 'localStorage'
    useEffect(()=> {
        // Convert currentUser to string before storing it, because it is an 'Object'.
        // Cannot store 'Objects' into 'localStorage'. Only stores 'string'
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        // Make 'currentUser' and 'login()' available everywhere inside...
        <AuthContext.Provider value={{currentUser, login}}>
            {children}
        </AuthContext.Provider>
    );
};