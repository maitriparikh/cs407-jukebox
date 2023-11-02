import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import { useNavigate } from "react-router-dom";
import ButtonBase from '@mui/material/ButtonBase';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ButtonGroup from '@mui/material/ButtonGroup';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useTheme } from '@mui/material/styles';
import { UserContext } from "../../App";


function DailyChallengeLobby() {
    const { user, setUser } = useContext(UserContext);
    const theme = useTheme();
    /* Navigation for buttons */
    const navigate = useNavigate();
    const [numOfRounds, setNumOfRounds] = useState("");
    const [songIndex, setSongIndex] = useState(15);
    const [songInfo, setSongInfo] = useState([])
    const [gameMode, setGameMode] = useState("Easy");
    // verifying that default daily challenge game mode is "Easy" if nothing is selected
    console.log("Daily Challenge Game Mode: ", gameMode);

    const modeSelection = (mode) => {
        setGameMode(mode);
    };

    

    /* SPOTIFY STUFF */
    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token

    const getSpotifyToken = async () => {
    const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
        setSpotifyToken(doc.data().spotifyToken);
        //userNameTemp = doc.data().username;
        //console.log('username is:' + userNameTemp);
        
    });
    };

    const fetchWebApi = async (endpoint, method, body) => {
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
        Authorization: `Bearer ${spotifyToken}`,
        },
        method,
        body: JSON.stringify(body),
    });
    return await res.json();
    };
    
    const getAllPlaylistTracks = async (playlistId) => {
        let allTracks = [];
        let nextUrl = `playlists/37i9dQZF1DXcBWIGoYBM5M/tracks`; // HARDCODED SPECIFIC PLAYLIST ............

        while (nextUrl) {
            const response = await fetchWebApi(nextUrl, 'GET');
            const { items, next } = response;
        
            if (items && Array.isArray(items)) {
                allTracks = [...allTracks, ...items];
            } else {
                // Handle the case where items is not iterable (e.g., it may be undefined or not an array)
                console.error('Items is not iterable:', items);
            }
        
            if (next) {
                nextUrl = new URL(next).pathname.substr(1); // Extract the next URL path
            } else {
            nextUrl = null;
        }
    };
    
    //console.log("ALL MY TRACKS: ", allTracks)

    // Extract track codes from allTracks and put them in myPlaylist
    
    /*const trackURIs = allTracks.map((track) => track.track.uri);

    const myPlaylistFinal = trackURIs.map((uri) => {
        return "https://open.spotify.com/embed/track/" + uri.substring(14) + "?utm_source=generator";
    });

    // Now you have myPlaylistFinal properly populated
    console.log("myPlaylistFinal", myPlaylistFinal);
    setMyPlaylist(myPlaylistFinal); */

    const song = allTracks[songIndex];
    console.log(song);

    // audio clip
    const previewURL = song.track.preview_url;
    console.log(previewURL);
    songInfo.push(previewURL);

    // artist name
    const artist = song.track.artists[0].name;
    console.log(artist);
    songInfo.push(artist);

    // album picture
    const albumPic = song.track.album.images[0].url;
    console.log(albumPic);
    songInfo.push(albumPic);

    // song name
    const songName1 = song.track.name;
    console.log(songName1);
    songInfo.push(songName1);

    /*const updatedSongInfo = [{
        songPreview: previewURL,
        songArtist: artist,
        songAlbumCover: albumPic,
        songName: songName1,
    }];
    
    //setSongInfo(updatedSongInfo);
    songInfo.push(updatedSongInfo);*/
    //console.log("1", updatedSongInfo)
    //console.log("2", songInfo)

    return allTracks;

    };

    const startgame_click = async () => {
        console.log("START GAME CLICKED");
        await getAllPlaylistTracks()
        navigate("/dailychallengegame", {
          state: {
            gameMode: gameMode,
            songInfo: songInfo
          },
        });
      };


    useEffect(()=>{

        getSpotifyToken()
        if (spotifyToken) {
            console.log("spotify token got in song roulette game lobby ->", spotifyToken)
            // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)
            /* make song_bank data structure */
        
        }
    
    }, [spotifyToken]);

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Daily Challenge
        </Typography>

        <br></br>

        <Card 
            style={{ 
            height: "270px", 
            border: `3px solid ${theme.palette.primary.main}`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "85%", 
            margin: "0 auto", 
            backgroundColor: theme.palette.background.default
            }}
        >

        <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", paddingBottom: "50px", paddingLeft: "100px", paddingRight: "100px" }}>
            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                {/* Daily challenge game instructions - update as needed */}
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: "16px" }}>
                    Welcome to Jukebox's daily challenge! Your task will be to guess a particular song with as few hints as possible. First, choose a game mode below. 
                </Typography>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    In easy mode, we will start you off with an an audio snippet from the mystery song. If you recognize the tune, enter it in the box that appears on your screen. If you can't, don't worry - we will continue giving you more hints (visual, lyrical, trivia-y, etc). For hard mode, you must guess the song from the audio snippet alone! Good luck!
                </Typography>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button 
                    variant={gameMode === "Easy" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115, 
                        backgroundColor: gameMode === "Easy" ? theme.palette.secondary.main : theme.palette.background.default, 
                        border: `2px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Easy")}>
                        Easy
                    </Button>
                    <Button 
                    variant={gameMode === "Hard" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115,  
                        backgroundColor: gameMode === "Hard" ? theme.palette.secondary.main : theme.palette.background.default, 
                        border: `2px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Hard")}>
                        Hard
                    </Button>
                </ButtonGroup>
            </Grid>
            </CardContent>
            </Card>

            <Grid item xs={12}>
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
                onClick={startgame_click}
                >
                Start Game!
                </Button>
            </Grid>
   
        </div>
      );
    }
    

export default DailyChallengeLobby;