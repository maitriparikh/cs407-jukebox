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
import { db } from "../../utils/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { UserContext } from "../../App";

import { useTheme } from '@mui/material/styles';

import StartGameSound from "../../sounds/start_game.mp3";


function TriviaChallengeLobby() {

    const theme = useTheme();

    const navigate = useNavigate();
    const [numOfRounds, setNumOfRounds] = useState(3);
    const { user, setUser } = useContext(UserContext);
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [songbank, setSongbank] = useState([]);
    const [topFiveArr, setTopFiveArr] = useState([]);

    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [albumNames, setAlbumNames] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [albumImages, setAlbumImages] = useState([]);

    const getArtists = async (list) => {
      var total = [];
      console.log("songbank in getArtists is " + songbank);
      for (let i = 0; i < list.length; i++) {
          var arr = [];
          for (let j = 0; j < list[i].artists.length; j++) {
              arr.push(list[i].artists[j].name);
          }
          total.push(arr);
      }
      setArtists(total);
      return total;
    };

    const getSongs = async (list) => {
        var total = [];
        for (let i = 0; i < list.length; i++) {
            total.push(list[i].name);
        }
        setSongs(total);
        return total;
    };

    const getAlbumNames = async (list) => {
        var names = [];
        var images = [];
        for (let i = 0; i < list.length; i++) {
            names.push(list[i].album.name);
        }
        setAlbumNames(names);
        return names;
    }

    const getAlbumImages = async (list) => {
      var images = [];
      for (let i = 0; i < list.length; i++) {
          images.push(list[i].album.images[0]);
      }
      setAlbumImages(images);
      return images;
  }

    const getPreviews = async (list) => {
        var total = [];
        for (let i = 0; i < list.length; i++) {
            total.push(list[i].preview_url);
        }
        setPreviews(total);
        return total;
    }

    const startgame_click = async () => {
        console.log("START GAME CLICKED");
        console.log(topFiveArr);
        //await buildSongBank()
        const audio = new Audio(StartGameSound);
        audio.play();
        navigate("/triviachallengegame", {
          state: {
            rounds: numOfRounds,
            songbank: songbank,
            artists: artists,
            songs: songs,
            previews: previews,
            albumNames: albumNames,
            albumImages: albumImages
          },
        });
    };

    const getSpotifyToken = async () => {
      const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
        setSpotifyToken(doc.data().spotifyToken);
        //userNameTemp = doc.data().username;
        //console.log('username is:' + userNameTemp);
        
      });
    };

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
      return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET')).items;
    }

    const displayTop = async() => {
      const topTracks = await getTopTracks();
      await setSongbank(topTracks);
      const dtArtists = await getArtists(topTracks);
      await setArtists(dtArtists);
      const dtSongs = await getSongs(topTracks);
      await setSongs(dtSongs);
      const dtPreviews = await getPreviews(topTracks);
      await setPreviews(dtPreviews);
      const dtAlbumNames = await getAlbumNames(topTracks);
      await setAlbumNames(dtAlbumNames);
      const dtAlbumImages = await getAlbumImages(topTracks);
      await setAlbumImages(dtAlbumImages);
      
      
    }

    

    useEffect(()=>{
        
        getSpotifyToken();
        if (spotifyToken) {
          console.log("spotify token got in song roulette game lobby ->", spotifyToken)
          // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)
          /* make song_bank data structure */
          displayTop();
        
        }
        
        
      }, [spotifyToken]);

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Trivia Challenge
        </Typography>

        <br></br>

        <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: '20px' }}
        >

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
            </Grid>
   
        </div>
      );
    }
  
    

export default TriviaChallengeLobby;