import React, { useState, useContext, useEffect } from "react";
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
import { UserContext } from "../../App";
import ButtonGroup from '@mui/material/ButtonGroup';
import { doc, onSnapshot, getDoc, setDoc, getDocs, query, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";



import { useTheme } from '@mui/material/styles';

import StartGameSound from "../../sounds/start_game.mp3";

function DoodleChallengeLobby() {

   const theme = useTheme();

   const { user, setUser } = useContext(UserContext);

   const navigate = useNavigate();

   const [gameMode, setGameMode] = useState("Draw");
    const modeSelection = (mode) => {
        setGameMode(mode);
    };
    console.log("Doodle Challenge Game Mode: ", gameMode);

    /* SPOTIFY STUFF */
    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
     
    const [personalSongBank, setPersonalSongBank] = useState([]); // REGULAR, EXPLICIT VERSION
    const [songInfoArray, setSongInfoArray] = useState([]); // All songInfo objects
    const [songInfo, setSongInfo] = useState([])
    const [finalPlaylist, setFinalPlaylist] = useState([]);
    const [randomDoodle, setRandomDoodle] = useState([]);

    const getPlaylistsFirebase = async () => {
        const userDoc = await getDoc(doc(db, "users", user));
        setSpotifyToken(userDoc.data().spotifyToken);

        let contentFilter = userDoc.data().contentFilter;
        if (contentFilter === "explicit") {
            console.log("EXPLICIT MODE")
            setPersonalSongBank(userDoc.data().personalSongBank);
        } else {
            console.log("FILTERED MODE")
            setPersonalSongBank(userDoc.data().personalSongBankClean);
        }

        const doodlesRef = collection(db, "doodle");
        const doodlesSnapshot = await getDocs(query(doodlesRef));
        const doodleDocs = doodlesSnapshot.docs;

        if (doodleDocs.length === 0) {
          // Handle the case where the collection is empty
          return null;
        }

        // Select a random document
        const randomDoc = doodleDocs[Math.floor(Math.random() * doodleDocs.length)];
        const randomDoodleData = randomDoc.data();

        // Do something with the random doodle data
        console.log("RANDOM DOODLE", randomDoodleData);
        setRandomDoodle(randomDoodleData);

    };

    const getAllPlaylistTracks = async (playlistId) => {

        console.log("FINAL PLAYLIST in getAllPlaylists ", finalPlaylist);

        let finalPlaylistFinal = finalPlaylist[0];
        console.log("FINAL PLAYLIST FINAL in getAllPlaylists ", finalPlaylistFinal);
        
        /* Send all song names to game  */
        const allSongNames = finalPlaylistFinal.map((track) => track.name);
        //console.log("allSongNames", allSongNames);

        allSongNames.map((name) => {
            myPlaylist.push(name);
        });
        //console.log("myPlaylist", myPlaylist)

        /* Get array of song info to send to game  */


        const songInfoArrayTemp = []
        for (var i = 0; i < finalPlaylistFinal.length; i++) {

            // Song info for song i
            const song = finalPlaylistFinal[i];
            
            const previewURL = song.preview_url; // audio clip            
            const artist = song.artists[0].name; // artist name
            const albumPic = song.album.images[0].url; // album picture
            const songName1 = song.name; // song name

            const songInfo1 = {
                songName: songName1,
                songArtist: artist,
                songAlbumPic: albumPic,
                songAudio: previewURL,
            };

            // add song i to songInfoArrayTemp
            songInfoArrayTemp.push(songInfo1)
        }

        console.log("songInfoArrayTemp", songInfoArrayTemp)
        
        let songInfoArrayTemp2 = shuffleArray(songInfoArrayTemp)
        //console.log("songInfoArrayTemp2 Shuffled", songInfoArrayTemp2)

        songInfoArrayTemp2 = songInfoArrayTemp2.splice(0, 5);

        songInfoArrayTemp2.map((songInfoTemp) => {
            songInfoArray.push(songInfoTemp)
        });

        console.log("songInfoArray FINAL", songInfoArray)


        return finalPlaylistFinal;

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

      getPlaylistsFirebase()
      if (spotifyToken) {
          console.log("spotify token got in song roulette game lobby ->", spotifyToken)
          // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)
          /* make song_bank data structure */
      }

  
  }, [finalPlaylist]);

    const startgame_click = async () => {
        console.log("START GAME CLICKED");
        await getPlaylistsFirebase()

        // if custom playlist exists, use that
        // if no custom playlist, and top songs exists, use top songs from Spotify
        // if no custom playlist or top songs (from Spotify), use music preferences from quiz

        finalPlaylist.push(personalSongBank);
        
        console.log("FINAL PLAYLIST AFTER CHECKING AVAILABLE PLAYLISTS", finalPlaylist);

        await getAllPlaylistTracks("0PSXEKFjY913mP2IKNEXnf")
        const audio = new Audio(StartGameSound);
        audio.play();
        navigate("/doodlechallengegame", {
          state: {
            allSongs: myPlaylist,
            songInfoArray: songInfoArray,
            gameMode: gameMode,
            randomDoodle: randomDoodle
          },
        });
      };

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Doodle Challenge
        </Typography>

        <br></br>
    
        <div>
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
                    Welcome to the Doodle Challenge! Your task will be to either draw or guess a specific song within the time limit. First, choose a game mode below.
                </Typography>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    In draw mode, we will give you 5 songs to choose between and then draw using the canvas below. In guess mode, we will give you a doodle created by another user and you must guess the corresponding song. In both modes, click "Submit" when you want to submit your doodle or answer. Good luck!
                </Typography>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button 
                    variant={gameMode === "Draw" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115, 
                        backgroundColor: gameMode === "Draw" ? theme.palette.secondary.main : theme.palette.background.default, 
                        border: `2px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Draw")}>
                        Draw
                    </Button>
                    <Button 
                    variant={gameMode === "Guess" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115,  
                        backgroundColor: gameMode === "Guess" ? theme.palette.secondary.main : theme.palette.background.default, 
                        border: `2px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Guess")}>
                        Guess
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

        </div>
      );
    }
    

export default DoodleChallengeLobby;