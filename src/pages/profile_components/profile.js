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
import { db, auth, storage } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useTheme } from '@mui/material/styles';


const spotify = new SpotifyWebApi();

function Profile() {
    const theme = useTheme();

    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");
    const [data, setData] = useState(null);
    const [topFive, setTopFive] = useState([]);
    const [spotifyName, setSpotifyName] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [ethnicity, setEthnicity] = useState("");

    /* Navigation for buttons */
    const navigate = useNavigate();

    const userSignOut = () => {
      signOut(auth).then(() => {
          console.log("sign out successful");
          setUser(null);
          navigate("/");
      }).catch(error => console.log(error))
    };

    const spotifySubmit_click = async () => {
      //console.log(getTokenFromUrl());
      //displayTop();

      console.log("NEED TO UPDATE ALTERNATIVE SOURCE TO FALSE HERE");
      
      const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          alternativeSource: false
        }, {
          merge: true
        }).then(() => {
          console.log("Document updated")
        }).catch((error) => {
          console.log("There was an error updating the doc with spotify token");
        });
    };

    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    const signOut_click = () => {
      console.log("SIGNED OUT");
      userSignOut();
    }

    const editProfile_click = () => {
      console.log("GO TO EDIT PROFILE");
      navigate("/editprofile");
    }

    const musicPreferencesQuiz_click = () => {
      console.log("GO TO MUSIC PREFERENCES QUIZ");
      navigate("/musicpreferencesquiz");
    }

    const customPlaylist_click = () => {
      navigate("/customPlaylist");
    }

    const fetchWebApi = async (endpoint, method, body) => {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}}`,
        },
        method,
        body:JSON.stringify(body)
      });
      return await res.json();
    }

    const getTopTracks = async () => {
      return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=20', 'GET')).items;
    }

    const displayTop = async() => {
      const topTracks = await getTopTracks();
      //console.log("The top tracks are: ", topTracks);
      console.log(
        topTracks?.map(
          ({name, artists}) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
        )
      );
    }
    

    useEffect(()=>{
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user.uid);

          //read current user data
          await onSnapshot(doc(db, "users", user.uid), async (doc) => {
            setFirstName(doc.data().firstName);
            setLastName(doc.data().lastName);
            setUsername(doc.data().username);
            setEmail(doc.data().email);
            setAge(doc.data().age);
            setGender(doc.data().gender);
            setEthnicity(doc.data().ethnicity);
            setSpotifyToken(doc.data().spotifyToken);
            const pathRef = ref(storage, `images/${doc.data().image}`);
            await getDownloadURL(pathRef).then(async (url) => {
              setImageURL(url);
            });
            console.log(doc.data());
          });

          //handle if spotify token is in url
          const full = getTokenFromUrl();
          console.log(full)
          const _spotifyToken = full.access_token;
          console.log(_spotifyToken);
          window.location.hash = "";
          if(_spotifyToken) {
            setSpotifyToken(_spotifyToken);
            spotify.setAccessToken(_spotifyToken);
            spotify.getMe().then((user) => {
              console.log("This is you: ", user);
              setSpotifyName(user.display_name);
            });

            //finding top 5 songs
            //console.log("A spotify token was found");
            const topTracks = await getTopTracks();
            //console.log(topTracks);
            /*
            var arr = [...topFive];
            topTracks?.map(
              ({id, name}) =>
                arr.push(`https://open.spotify.com/embed/track/${id}?utm_source=generator for ${name}`)
            )
            console.log(arr);
            setTopFive(arr);
            */
            
           
            
            

            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
              spotifyToken: _spotifyToken,
              //songList: topFive
            }, {
              merge: true
            }).then(() => {
              console.log("Document updated")
            }).catch((error) => {
              console.log("There was an error updating the doc with spotify token");
            });
          }
          
          console.log("before st condition: ", spotifyToken);
          if (spotifyToken !== "") {
            console.log("A spotify token was found");
            const topTracks = await getTopTracks();
            var arr = [...topFive];
            topTracks?.map(
              ({id, name}) =>
                arr.push(`https://open.spotify.com/embed/track/${id}?utm_source=generator for ${name}`)
            )
            console.log(arr);
            setTopFive(arr);
            console.log(
              topTracks?.map(
                ({id, name}) =>
                  `https://open.spotify.com/embed/track/${id}?utm_source=generator for ${name}`
              )
            );
            console.log("Top Five is: ", topFive);
          }
          
        } else {
          console.log("auth state where no user");
          navigate("/");
        }
      })


    }, []);

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h2" style={{ textAlign: "left" }}>
            My Profile
        </Typography>

        <br></br>

        <Grid container spacing={4}>

          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "250px", width: "100%", backgroundColor: theme.palette.background.default }}>
              <CardContent>
              <div>
              <Avatar
                src={imageURL}
                sx={{
                  width: 150,
                  height: 150,
                  border: `3px solid ${theme.palette.primary.main}`,
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
          <Card elevation={3} style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, border:`3px solid ${theme.palette.primary.main}`, borderRadius: "8px", height: "200px", width: "100%" }}>
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
          <br></br>
          <Card elevation={3} style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, border:`3px solid ${theme.palette.primary.main}`, borderRadius: "8px", height: "200px", width: "100%" }}>
            <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                Age: {age}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                Gender: {gender}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                Ethnicity: {ethnicity}
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "250px", width: "100%", backgroundColor: theme.palette.background.default }}>
              <CardContent>
              <Stack spacing={2} direction="column" alignItems="center">
                  <Button
                    variant="contained"
                    href={loginUrl}
                    onClick={spotifySubmit_click}
                    style={{
                      width: 230,
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.secondary.main,
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
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.secondary.main,
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                    onClick={musicPreferencesQuiz_click}
                  >
                    Music Preferences Quiz
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.secondary.main,
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                    onClick={customPlaylist_click}
                  >
                    Add Custom Spotify Playlist
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.secondary.main,
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
        
       
        {spotifyName === "" ? <p></p> : (
                    <Typography variant="p" style={{ textAlign: 'left' }}> 
                      You have connected with <b>{spotifyName}</b>!
                    </Typography>
                  )}



        <br></br>
          <br></br>
        
        
        <Button
            variant="contained"
            style={{
              width: 230,
              color: "#DE6600",
              backgroundColor: theme.palette.secondary.main,
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