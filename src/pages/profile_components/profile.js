import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LogoutIcon from "@mui/icons-material/Logout";
import { getTokenFromUrl, loginUrl } from "../../utils/spotify";
import SpotifyWebApi from "spotify-web-api-js";
import { UserContext } from "../../App";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
const spotify = new SpotifyWebApi();

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");
    const [data, setData] = useState(null);

    /* Navigation for buttons */
    const navigate = useNavigate();

    const spotifySubmit_click = () => {
      //console.log(getTokenFromUrl());
    };

    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    const signOut_click = () => {
      console.log("SIGNED OUT");
      navigate("/");
    }

    const editProfile_click = () => {
      console.log("GO TO EDIT PROFILE");
      navigate("/editprofile");
    }

    useEffect(()=>{
      const unsubUserDoc = onSnapshot(doc(db, "users", "dSGIYen09jWLA3gNPM88aVGaMUs2"), async (doc) => {
        setFirstName(doc.data().firstName);
        setLastName(doc.data().lastName);
        setUsername(doc.data().username);
        setEmail(doc.data().email);
        console.log(doc.data());
      });

      console.log("This is what we received: ", getTokenFromUrl());
      const _spotifyToken = getTokenFromUrl().access_token;
      window.location.hash = "";
      console.log("This is our spotify token: ", _spotifyToken);

      if(_spotifyToken) {
        setSpotifyToken(_spotifyToken);
        spotify.setAccessToken(_spotifyToken);
        spotify.getMe().then((user) => {
          console.log("This is you: ", user);
        })
        //if the spotify token exists then we add it to the user's doc
        const docRef = doc(db, "users", "dSGIYen09jWLA3gNPM88aVGaMUs2");

        setDoc(docRef, {
          spotifyToken: _spotifyToken
        }, {
          merge: true
        }).then(() => console.log("Document updated"));
      }
      
      return unsubUserDoc;

    }, []);

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h1" style={{ textAlign: "left" }}>
            My Profile
        </Typography>

        <br></br>

        <Grid container spacing={4}>

          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "250px", width: "100%" }}>
              <CardContent>
              <div>
              <Avatar
                src={Logo}
                sx={{
                  width: 150,
                  height: 150,
                  border: "3px solid var(--text-color)",
                  borderRadius: "50%", 
                  margin: "auto", 
                }}
              >
              </Avatar>

            </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={5}>
          <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `3px solid var(--text-color)`, borderRadius: "8px", height: "200px", width: "100%" }}>
            <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {firstName} {lastName}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {username}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {email} 
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "200px", width: "100%" }}>
              <CardContent>
              <Stack spacing={2} direction="column" alignItems="center">
                  <Button
                    variant="contained"
                    href={loginUrl}
                    onClick={spotifySubmit_click}
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                  >
                    Connect to Spotify
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                  >
                    Update Music Preferences
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                    onClick={editProfile_click}
                  >
                    Edit Profile
                  </Button>
                  
                </Stack>

              </CardContent>
            </Card>
          </Grid>
  
        </Grid>

        <br></br>

        <Button
            variant="contained"
            style={{
              width: 230,
              color: "#DE6600",
              backgroundColor: 'var(--accent-color)',
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold",
            }}
            onClick={signOut_click}
          >
            <LogoutIcon sx={{ color: "#DE6600" }} /> &nbsp; Sign Out
          </Button>
  
        </div>
      );
    }

export default Profile;