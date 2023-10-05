import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
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
import CancelIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../App";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";


// STILL TO DO: ensure that the song bank length is >= # of rounds chosen (or else not enough songs for game)

function SongRouletteLobby() {

    /* Navigation for buttons */
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [numOfRounds, setNumOfRounds] = useState(3);
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [people, setPeople] = useState([]);
    const [song_bank, setSong_bank] = useState([]);
    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [myPlaylistFinal2, setMyPlaylistFinal2] = useState([ // Maitri hard coded playlist
      "https://open.spotify.com/embed/track/4JQpghvT0ZH2WLRqzlPUC7?utm_source=generator",
      "https://open.spotify.com/embed/track/4PMdq7Q7xOFrY424ZelZEb?utm_source=generator",
      "https://open.spotify.com/embed/track/1pacwLXyRO47ka0v6LTIiY?utm_source=generator",
      "https://open.spotify.com/embed/track/0aV5uARAknQgYhBaK944FP?utm_source=generator",
      "https://open.spotify.com/embed/track/6WzRpISELf3YglGAh7TXcG?utm_source=generator",
      "https://open.spotify.com/embed/track/1Qrg8KqiBpW07V7PNxwwwL?utm_source=generator",
      "https://open.spotify.com/embed/track/5nujrmhLynf4yMoMtj8AQF?utm_source=generator",
      "https://open.spotify.com/embed/track/4h9wh7iOZ0GGn8QVp4RAOB?utm_source=generator",
      "https://open.spotify.com/embed/track/7bPWdJgx8vek7S5i5yAtvG?utm_source=generator",
      "https://open.spotify.com/embed/track/3v5WRAItrZgr5vCdW3vTmz?utm_source=generator",
      "https://open.spotify.com/embed/track/3F1P0QzdXtBz0MXy7KIO5w?utm_source=generator",
      "https://open.spotify.com/embed/track/2dHHgzDwk4BJdRwy9uXhTO?utm_source=generator",
      "https://open.spotify.com/embed/track/6GGtHZgBycCgGBUhZo81xe?utm_source=generator",
      "https://open.spotify.com/embed/track/3gilyLEPttYyyo9NTNyAwx?utm_source=generator",
      "https://open.spotify.com/embed/track/6ToFxXRBtl5TJFEyIoYK3f?utm_source=generator"
    ]);
    const [myPlaylistFinal3, setMyPlaylistFinal3] = useState([ // Francisco hard coded playlist
      "https://open.spotify.com/embed/track/4PMdq7Q7xOFrY424ZelZEb?utm_source=generator",
      "https://open.spotify.com/embed/track/3v5WRAItrZgr5vCdW3vTmz?utm_source=generator",
      "https://open.spotify.com/embed/track/3F1P0QzdXtBz0MXy7KIO5w?utm_source=generator",
      "https://open.spotify.com/embed/track/32OlwWuMpZ6b0aN2RZOeMS?utm_source=generator",
      "https://open.spotify.com/embed/track/34gCuhDGsG4bRPIf9bb02f?utm_source=generator",
      "https://open.spotify.com/embed/track/2JzZzZUQj3Qff7wapcbKjc?utm_source=generator",
      "https://open.spotify.com/embed/track/4B0JvthVoAAuygILe3n4Bs?utm_source=generator",
      "https://open.spotify.com/embed/track/1Lim1Py7xBgbAkAys3AGAG?utm_source=generator",
      "https://open.spotify.com/embed/track/3zHq9ouUJQFQRf3cm1rRLu?utm_source=generator",
      "https://open.spotify.com/embed/track/5jsw9uXEGuKyJzs0boZ1bT?utm_source=generator",
      "https://open.spotify.com/embed/track/2K87XMYnUMqLcX3zvtAF4G?utm_source=generator",
      "https://open.spotify.com/embed/track/09CtPGIpYB4BrO8qb1RGsF?utm_source=generator",
      "https://open.spotify.com/embed/track/4VnDmjYCZkyeqeb0NIKqdA?utm_source=generator",
      "https://open.spotify.com/embed/track/1NZs6n6hl8UuMaX0UC0YTz?utm_source=generator"
    ]);
    const [myPlaylistFinal4, setMyPlaylistFinal4] = useState([ // Sean hard coded playlist
      "https://open.spotify.com/embed/track/6ToFxXRBtl5TJFEyIoYK3f?utm_source=generator",
      "https://open.spotify.com/embed/track/3F1P0QzdXtBz0MXy7KIO5w?utm_source=generator",
      "https://open.spotify.com/embed/track/2dHHgzDwk4BJdRwy9uXhTO?utm_source=generator",
      "https://open.spotify.com/embed/track/6GGtHZgBycCgGBUhZo81xe?utm_source=generator",
      "https://open.spotify.com/embed/track/2wSTnntOPRi7aQneobFtU4?utm_source=generator",
      "https://open.spotify.com/embed/track/0qcr5FMsEO85NAQjrlDRKo?utm_source=generator",
      "https://open.spotify.com/embed/track/10eBRyImhfqVvkiVEGf0N0?utm_source=generator",
      "https://open.spotify.com/embed/track/2Ch7LmS7r2Gy2kc64wv3Bz?utm_source=generator",
      "https://open.spotify.com/embed/track/2pIUpMhHL6L9Z5lnKxJJr9?utm_source=generator",
      "https://open.spotify.com/embed/track/6nGeLlakfzlBcFdZXteDq7?utm_source=generator",
      "https://open.spotify.com/embed/track/2D4dV2KXDTszzJ3p3cFqhA?utm_source=generator",
      "https://open.spotify.com/embed/track/5fpyAakgFOm4YTXkgfPzvV?utm_source=generator",
      "https://open.spotify.com/embed/track/7x9aauaA9cu6tyfpHnqDLo?utm_source=generator",
      "https://open.spotify.com/embed/track/5OCJzvD7sykQEKHH7qAC3C?utm_source=generator",
      "https://open.spotify.com/embed/track/5mjYQaktjmjcMKcUIcqz4s?utm_source=generator"
    ]);

    const startgame_click = async () => {
      console.log("START GAME CLICKED");
      await buildSongBank()
      navigate("/songroulettegame", {
        state: {
          rounds: numOfRounds,
          people: people,
          song_bank: song_bank
        },
      });
    };

    const getSpotifyToken = async () => {
      const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
        setSpotifyToken(doc.data().spotifyToken);
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
      let nextUrl = `playlists/0PSXEKFjY913mP2IKNEXnf/tracks`; // HARDCODED SPECIFIC PLAYLIST ............
    
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
    
      const trackURIs = allTracks.map((track) => track.track.uri);
      setMyPlaylist(trackURIs);

      const myPlaylistFinal = trackURIs.map((uri) => {
        return "https://open.spotify.com/embed/track/" + uri.substring(14) + "?utm_source=generator";
      });

      // Now you have myPlaylistFinal properly populated
      console.log("myPlaylistFinal", myPlaylistFinal);


      // Fill people data structure 
      const person = {
        name: "Shreya",
        flag: false,
        points: 0,
        playlist: myPlaylistFinal
      }
      people.push(person) // add person to people data structure, in multiplayer add other people too

      // add hardcoded other person to the data structure, other people will come to multiplayer later
      const person2 = {
        name: "Maitri",
        flag: false,
        points: 0,
        playlist: myPlaylistFinal2
      }
      people.push(person2) 

      const person3 = {
        name: "Francisco",
        flag: false,
        points: 0,
        playlist: myPlaylistFinal3
      }
      people.push(person3) 

      const person4 = {
        name: "Sean",
        flag: false,
        points: 0,
        playlist: myPlaylistFinal4
      }
      people.push(person4) 

      console.log(people)

      return allTracks;

    };

    const buildSongBank = async () => {
      /* create a combined playlist from both users (will be from more than 2 later) */
    
      await getAllPlaylistTracks();
    
      // find random songs corresponding to numOfRounds
      // populate song bank with song and people who have the song
      let megaPlaylist = [];
      
      for (let i = 0; i < people.length; i++) {
        console.log("i", people[i].playlist);
        megaPlaylist = megaPlaylist.concat(people[i].playlist);
      }
      console.log("MEGA PLAYLIST: ", megaPlaylist);
    
      for (let i = 0; i < numOfRounds; i++) {
        let song;
        let correctAnswer;
    
        do {
          const index = Math.floor(Math.random() * megaPlaylist.length);
          song = megaPlaylist[index];
          correctAnswer = [];
    
          /* find the people who have that song */
          for (let j = 0; j < people.length; j++) {
            const curName = people[j].name;
            const curPlaylist = people[j].playlist;
    
            if (curPlaylist.includes(song)) {
              correctAnswer.push(curName);
            }
          }
        } while (song_bank.some((bankItem) => bankItem.song === song));
    
        const songInBank = {
          song: song, 
          correctAnswer: correctAnswer
        };
        console.log("SONG ADDED TO BANK: ", songInBank);
    
        song_bank.push(songInBank);
      }
    
      console.log("song_bank", song_bank);
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

      {/*<div>
      <iframe 
                style={{ borderRadius: '12px' }}
                src={"https://open.spotify.com/embed/track/4VnDmjYCZkyeqeb0NIKqdA?utm_source=generator"}
                width="70%" 
                height="200" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
    </div>*/}

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Song Roulette
        </Typography>

        <br></br>

        <Typography variant="h4" style={{ textAlign: "center" }}>
            Join a lobby now to play Song Roulette with your friends! The host will choose the number of rounds
            and start the game. Each round will have a song from one of the player's playlists. Guess which friend has the song 
            in their playlist to get points. Don't forget to select multiple players if you think more than one of them has the 
            song in their playlist! Good luck! 🤩
        </Typography>

        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={8}>
            <Card elevation={3} sx={{
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "450px",
              width: "100%",
            }}
            >
              <CardContent>
                <Typography variant="h3" component="div">
                  Game Lobby
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "450px",
              width: "100%",
            }}
            >
              <CardContent>
                <Typography variant="h3" component="div">
                  Game Settings
                </Typography>

                <br></br>

                {/* MAKE SURE ONLY GAME HOST HAS CONTROL OF ROUNDS AND STARTING GAME */}

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

              </CardContent>
            </Card>
          </Grid>
    
        </Grid>


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
          onClick={startgame_click}
        >
          Start Game!
        </Button>
        
        </div>
      );
    }
  

export default SongRouletteLobby;