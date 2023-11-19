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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useTheme } from '@mui/material/styles';
import { UserContext } from "../../App";
import ButtonGroup from '@mui/material/ButtonGroup';

import StartGameSound from "../../sounds/start_game.mp3";


function SongSnippetLobby() {

    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [numOfRounds, setNumOfRounds] = useState(3);
    const [gameMode, setGameMode] = useState("Easy");
    // verifying that default daily challenge game mode is "Easy" if nothing is selected

    /* SPOTIFY STUFF */
    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [songInfoArray, setSongInfoArray] = useState([]); // All songInfo objects
    const [songInfo, setSongInfo] = useState([])

    const modeSelection = (mode) => {
        setGameMode(mode);
    };


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
        let nextUrl = `playlists/${playlistId}/tracks`; // HARDCODED SPECIFIC PLAYLIST ............ 

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
        

        
        /* Send all song names to game  */
        const allSongNames = allTracks.map((track) => track.track.name);
        console.log("allSongNames", allSongNames);

        allSongNames.map((name) => {
            myPlaylist.push(name);
        });
        console.log("myPlaylist", myPlaylist)

        /* Get array of song info to send to game  */


        const songInfoArrayTemp = []
        for (var i = 0; i < allTracks.length; i++) {

            // Song info for song i
            const song = allTracks[i];
            
            const previewURL = song.track.preview_url; // audio clip
            //songInfo1.push(previewURL);
            
            const artist = song.track.artists[0].name; // artist name
            //songInfo1.push(artist);
            
            const albumPic = song.track.album.images[0].url; // album picture
            //songInfo1.push(albumPic);
            
            const songName1 = song.track.name; // song name
            //songInfo1.push(songName1);

            const songInfo1 = {
                songName: songName1,
                songArtist: artist,
                songAlbumPic: albumPic,
                songAudio: previewURL,
                points: 100,
                tries: 3
            };

            // add song i to songInfoArrayTemp
            songInfoArrayTemp.push(songInfo1)
        }

        console.log("songInfoArrayTemp before removing songs", songInfoArrayTemp)

        // remove random songs until length matches rounds
        while (songInfoArrayTemp.length > numOfRounds) {

            const indexToRemove = Math.floor(Math.random() * songInfoArrayTemp.length);
            //remove that element from the array
            songInfoArrayTemp.splice(indexToRemove, 1);
        }
        console.log("songInfoArrayTemp", songInfoArrayTemp)
        
        const songInfoArrayTemp2 = shuffleArray(songInfoArrayTemp)
        console.log("songInfoArrayTemp2 Shuffled", songInfoArrayTemp2)

        songInfoArrayTemp2.map((songInfoTemp) => {
            songInfoArray.push(songInfoTemp)
        });

        console.log("songInfoArray FINAL", songInfoArray)


        /* Get specific song info to send to game  */
        const song = allTracks[0];
        // audio clip
        const previewURL = song.track.preview_url;
        songInfo.push(previewURL);
        // artist name
        const artist = song.track.artists[0].name;
        songInfo.push(artist);
        // album picture
        const albumPic = song.track.album.images[0].url;
        songInfo.push(albumPic);
        // song name
        const songName1 = song.track.name;
        songInfo.push(songName1);

        return allTracks;

    };

    const startgame_click = async () => {
        console.log("START GAME CLICKED");
        await getAllPlaylistTracks("0PSXEKFjY913mP2IKNEXnf")
        const audio = new Audio(StartGameSound);
        audio.play();
        navigate("/songsnippetgame", {
          state: {
            gameMode: gameMode,
            allSongs: myPlaylist,
            songInfo: songInfo,
            songInfoArray: songInfoArray
          },
        });
      };

      const shuffleArray = (array) => {
        // Create a copy of the original array
        const shuffledArray = [...array];
        let currentIndex = shuffledArray.length, randomIndex, temporaryValue;
    
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
    
          // And swap it with the current element.
          temporaryValue = shuffledArray[currentIndex];
          shuffledArray[currentIndex] = shuffledArray[randomIndex];
          shuffledArray[randomIndex] = temporaryValue;
        }
    
        return shuffledArray;
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
            Song Snippet Challenge
        </Typography>

        <br></br>

        <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: '20px' }}
        >

            

            </Grid>

        <Card 
            style={{ 
            height: "100%", 
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
            <br></br>
            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                {/* Daily challenge game instructions - update as needed */}
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: "16px" }}>
                    Welcome to the Song Snippet Challenge! Your task during each round will be to 
                    guess a song with as few hints as possible. First, choose a game 
                    mode below. Then, choose the number of rounds you wish to play
                </Typography>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    In easy mode, we will start you off with an an audio snippet 
                    from the mystery song. If you recognize the tune, enter it in the box 
                    that appears on your screen. If you can't, don't worry - we will 
                    continue giving you more hints. For hard mode, you must guess the song 
                    from the audio snippet alone! 
                    Good luck!
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

            <br></br>
            <Grid item xs={12}>
            {/* Number of Rounds */}
            <FormControl>
            <InputLabel id="demo-simple-select-label" label="label">
                Rounds
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Rounds"
                defaultValue={3} 
                style={{ minWidth: '150px' }}
                onClick={(event) => setNumOfRounds(event.target.innerText)}
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
            </Select>
            </FormControl>
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
    

export default SongSnippetLobby;