import React, { useEffect, useState, useContext } from 'react';
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import App from '../App';

const AuthDetails = () => {
    const { user, setUser } = useContext(UserContext);
    const [authUser, setAuthUser] = useState(null);

      /* Navigation for buttons */
    const navigate = useNavigate();

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
                setUser(user.uid);
            } else {
                setAuthUser(null);
                //setUser(null);
            }
        });
            return () => {
                listen();
            }
    }, [user]);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log("sign out successful");
            //setUser(null);
            navigate("/");
        }).catch(error => console.log(error))
    };

    
}

export default AuthDetails;