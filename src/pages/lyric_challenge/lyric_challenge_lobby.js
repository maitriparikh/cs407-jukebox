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

import { useTheme } from '@mui/material/styles';

import { apiKey } from "../../utils/musicmxtch";
import { db, auth, storage } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserContext } from "../../App";

import StartGameSound from "../../sounds/start_game.mp3";
import DownloadingIcon from '@mui/icons-material/Downloading';

function LyricChallengeLobby() {

    const copyRight = "******* This Lyrics is NOT for Commercial use *******\n(1409624001866)";
    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);

    const [numOfRounds, setNumOfRounds] = useState(3);
    const [songLyricsArray, setSongLyricsArray] = useState([]);
    const [songArray, setSongArray] = useState([]);
    const [track, setTrack] = useState("");
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);

    const [fSongs, setFSongs] = useState([]);
    const [fArtists, setFArtists] = useState([]);

    const [ready, setReady] = useState(false);

    const navigate = useNavigate();


    const getArtists = (list) => {
        var total = [];
        console.log("songbank in getArtists is " + songArray);
        for (let i = 0; i < list.length / 2; i++) {
            total.push(list[i].artists[0].name);
        }
        console.log(total);
        setArtists(total);
        return total;
    };
  
    const getSongs = (list) => {
        var total = [];
        for (let i = 0; i < list.length / 2; i++) {
            total.push(list[i].name);
        }
        console.log(total);
        setSongs(total);
        return total;
    };

    const fetchWebApi = async (endpoint, method, body) => {
        try {
            const res = await fetch(`https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/${endpoint}`, {
            headers: {
                'x-cors-api-key': 'test_67e4935f9a2b83b9de1c604ce6f657d02f1beb8b28847374d9fa5f8d1b195ec6',
                'origin': 'http://localhost:3000/lyricchallengelobby'
            },
            method,
            body:JSON.stringify(body)
            });
            return await res.json();
        } catch(error) {
            console.error("There was an error with the fetch web api call");
            return null;
        }
        
      }

    const fetchLyrics = async (track, song, artist) => {
        console.log("inside fetch with " + track);
        await fetchWebApi(`track.lyrics.get?track_id=${track}&apikey=650a3fdb8d7d1f523343720cf1b0e519`, 'GET')
        .then(async (res) => {
            console.log("inside res");
            if (res !== null) {
                if (typeof res.message.body.lyrics !== 'undefined') {
                    let sLyrics = res.message.body.lyrics.lyrics_body.replace(copyRight, "");
                    let msLyrics = sLyrics.replace("\n...\n\n", "");
                    const lineArray = msLyrics.split("\n");
                    console.log(lineArray);
                    songLyricsArray.push(lineArray);
                    fSongs.push(song);
                    fArtists.push(artist);
                } else {
                    songLyricsArray.push("No song lyrics");
                    console.error("Song (trackid: " + track + ") did not have lyrics");
                }
            }
            
            
        })
    }

    const fetchTrackId = async (song, artist) => {
        await fetchWebApi(`track.search?q_artist=${artist}&q_track=${song}&page_size=1&page=1&s_track_rating=desc&apikey=650a3fdb8d7d1f523343720cf1b0e519`, 'GET')
        .then(async (res) => {
            //console.log(res.message.body.track_list[0].track.track_id);
            //console.log(res);
            if (typeof res.message.body.track_list !== 'undefined' && res.message.body.track_list.length > 0) {
                if (res.message.body.track_list[0].track.track_id) {
                    const trackid = res.message.body.track_list[0].track.track_id;
                    await fetchLyrics(trackid, song, artist);
                } else {
                    console.error("This song could not be found: " + song + " by " + artist);
                }
            } else {
                //songLyricsArray.push("No song lyrics");
                console.error("There was not a track list for this song");
            }
        }).catch(error => {
            console.log("there was an error");
            //songLyricsArray.push("No song lyrics");
        })
    }

    const testLyrics = async () => {
        await fetchTrackId("Super Shy", "NewJeans");
        await fetchTrackId("war", "Hypnotic Brass Ensemble");
        await fetchTrackId("baby", "justin bieber");
        const song = 'Bagatelle No. 25 in a minor woo 59 "für elise"';
        console.log(song);
        await fetchTrackId(song, "Ludwig van Beethoven")
    }

    const getAllLyrics = async (array) => {
        const aArt = await getArtists(array);
        setArtists(aArt);
        const aSon = await getSongs(array);
        setSongs(aSon);
        console.log(artists);
        console.log(songs);
        for (let i = 0; i < 10; i++) {
            await fetchTrackId(aSon[i], aArt[i]);
        }
        while( fSongs.length < 9) {
            //setReady(false);
        }
        setReady(true);
    };

    const startgame_click = async () => {
        //console.log("START GAME CLICKED");
        const audio = new Audio(StartGameSound);
        audio.play();
        navigate("/lyricchallengegame", {
          state: {
            rounds: numOfRounds,
            songbank: songArray,
            artists: fArtists,
            songs: fSongs,
            lyrics: songLyricsArray,
            tartists: artists,
            tsongs: songs
          },
        });
    };

    
    useEffect(()=>{
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("start");
                await onSnapshot(doc(db, "users", user.uid), async (doc) => {
                    //console.log(doc.data().personalSongBank);
                    if (doc.data().contentFilter === "explicit") {
                        setSongArray(doc.data().personalSongBank);
                        getAllLyrics(doc.data().personalSongBank);
                      } else {
                        setSongArray(doc.data().personalSongBankClean);
                        getAllLyrics(doc.data().personalSongBankClean);
                    }
                });
                
            }

        })
        
        
    }, []);
    

    return (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Lyric Challenge
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
            <Grid item xs={12} style={{ marginBottom: "25px", marginTop: "40px" }}>
                {/* Daily challenge game instructions - update as needed */}
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: "16px" }}>
                    Welcome to the Lyric Challenge! Your task during each round will be to 
                    guess a song based on the available. First, choose the number of rounds you wish to play. 
                    Then, press start game.
                </Typography>
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

            

            <br></br>

            {ready ? (<div>
              <label htmlFor="profile-picture-delete">
              <Button
                variant="contained"
                style={{
                    width: 230,
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.secondary.main,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: "auto"
                }}
                onClick={startgame_click}
                >
                Start Game
              </Button>
              </label>
            </div>) : 
            (
              <div>
              <label htmlFor="profile-picture-delete">
              <Button disabled
                variant="contained"
                style={{
                    width: 230,
                    color: "gray",
                    backgroundColor: "light gray",
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: "auto"
                }}
                
                >
                <DownloadingIcon/> &nbsp; Loading Lyrics
              </Button>
              </label>
            </div>
            )
            }

            
   
        </div>
      );
    }
    

export default LyricChallengeLobby;