import { useEffect, useState } from "react";
import {AuthContext} from "./AuthContext";
import axios from "axios";


export const AuthContextProvider = ({children}) => {

    // Current User is an Object (Contains user info - name, profile-pic etc...)
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

  const login = async(inputs) => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", inputs, {
            withCredentials: true, // Ensure cookies are sent with the request
        });

        // Set the current user and store it in localStorage
        setCurrentUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    
    catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw the error so it can be caught in the Login component
    }
  }

    // Set Current User info in 'localStorage'
    useEffect(()=> {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        // Make 'currentUser' and 'login()' available everywhere inside...
        <AuthContext.Provider value={{currentUser, login}}>
            {children}
        </AuthContext.Provider>
    );
};