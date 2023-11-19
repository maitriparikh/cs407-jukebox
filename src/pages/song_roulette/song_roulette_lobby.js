import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import { db } from "../../utils/firebase";

import StartGameSound from "../../sounds/start_game.mp3";


// STILL TO DO: ensure that the song bank length is >= # of rounds chosen (or else not enough songs for game)
import io from 'socket.io-client';

import { useTheme } from '@mui/material/styles';
import {TopFiveArrExport} from  "../homepage";

    

const socket = io('http://localhost:3001');

function SongRouletteLobby() {

    const theme = useTheme();

    /* Navigation for buttons */
    const navigate = useNavigate();
    const location = useLocation();




    const { user, setUser } = useContext(UserContext);
    const [numOfRounds, setNumOfRounds] = useState(3);
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [people, setPeople] = useState([]);
    const [song_bank, setSong_bank] = useState([]);
    const [lobbies, setLobbies] = useState([]);
    const [currentLobby, setCurrentLobby] = useState([]);
    const top5arr = TopFiveArrExport;
    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [isButtonDisabledOwner, setButton] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [readyToStart, setIsReadyToStart] = useState(false);
    

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

      if ( currentLobby.length!= 0) {
        await buildSongBank()
        
        currentLobby.gameSongs = song_bank;
        currentLobby.peopleGame = people;
        socket.emit('game-started',currentLobby.ownerID, song_bank,numOfRounds, people  );

        

        const audio = new Audio(StartGameSound);
        audio.play();
        navigate("/songroulettegame", {
            state: {
              rounds: numOfRounds,
              people: people,
              song_bank: song_bank,
              lobby: currentLobby
            },
        });
      }
    };


    
    const deleteLobby = () => {
     // console.log("testing delete")
      //console.log(currentLobby.ownerID)
      //console.log(lobbies)
      getCurrentLobby();

      if (currentLobby.length!= 0) {
        socket.emit('delete-lobby', currentLobby.ownerID);
        navigate("/songroulettelobbybrowser" , {
          state: {
          top5: top5arr
          },
        } );
      }
    };

    const leaveLobby = (user, owner) => {
      socket.emit('leave-lobby', { user, owner });
    }


    



    const [lobbyUsers, setLobbyUsers] = useState([]);
    let userNameTemp;

    const getSpotifyToken = async () => {
      const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
        setSpotifyToken(doc.data().spotifyToken);
        //userNameTemp = doc.data().username;
        //console.log('username is:' + userNameTemp);
        socket.emit('fetch-lobbies');
        
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

    
    useEffect(() => {
      
      //socket.emit('fetch-lobbies');
      /*
      socket.on('update-lobbies', (updatedLobbies) => {
          setLobbies(updatedLobbies);
          
         
      });
      return () => {
        //socket.off('update-lobbies');
         
      };
      */
    }, []);

    function findLobbyByPlayerId(lobbies, targetId) {
      //console.log("current lobbies")
      //console.log(lobbies);
      return lobbies.find(lobby => lobby.players.includes(targetId));
    }

    

          

    const getCurrentLobby =  () => {
      const tempThing =  findLobbyByPlayerId(lobbies, user);
      //console.log("start")
      //console.log(lobbies)
      //console.log(user)
      //console.log("finish")

      if (tempThing) {
        setCurrentLobby(tempThing); // If a lobby is found, set the currentLobby state
        console.log("Current Lobby:", tempThing);
        //console.log("Current user ID:", user);
        //console.log("Current Lobby owner ID:", tempThing.ownerID);
      } else {
        //setCurrentLobby(null); // If no lobby is found, set currentLobby as null
        console.log("No lobby found for the current user:", user);
        console.log(lobbies)
        //console.log(lobbies)
      }
      //console.log("start2")
      //console.log(lobbies)
      //console.log(user)
      //console.log("finish2")

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
      
      

      const myPlaylistFinal = currentLobby.gameData[0].map((track) => {
        return "https://open.spotify.com/embed/track/" + track.uri.substring(14) + "?utm_source=generator";
      });

      const myPlaylistDynamic2 = currentLobby.gameData[1].map((track) => {
        return "https://open.spotify.com/embed/track/" + track.uri.substring(14) + "?utm_source=generator";
      });
      
      const myPlaylistDynamic3 = currentLobby.gameData[2].map((track) => {
        return "https://open.spotify.com/embed/track/" + track.uri.substring(14) + "?utm_source=generator";
      });

      const myPlaylistDynamic4 = currentLobby.gameData[3].map((track) => {
        return "https://open.spotify.com/embed/track/" + track.uri.substring(14) + "?utm_source=generator";
      });
      
      if (currentLobby.gameData[0] == null) {
        console.log("ERROR reading player 1 game data");
      }
      if (currentLobby.gameData[1] == null) {
         console.log("ERROR reading player 2 game data");
      }
      if (currentLobby.gameData[2] == null) {
         console.log("ERROR reading player 3 game data");
      }
      if (currentLobby.gameData[3] == null) {
         console.log("ERROR reading player 4 game data");
      }

      //const myPlaylistFinal = generateEmbeddedTrackURLs(currentLobby.gameData[0]);
     

      // Now you have myPlaylistFinal properly populated
      //console.log("myPlaylistFinal", myPlaylistFinal);


      if (true) {
        const person = {
          name: currentLobby.playerNames[0],
          flag: false,
          points: 0,
          playlist: myPlaylistFinal
        }
        people.push(person);
        const person2 = {
          name: currentLobby.playerNames[1],
          flag: false,
          points: 0,
          playlist: myPlaylistDynamic2
        }

        people.push(person2);
        
        const person3 = {
          name: currentLobby.playerNames[2],
          flag: false,
          points: 0,
          playlist: myPlaylistDynamic3
        }

        people.push(person3);

        const person4 = {
          name: currentLobby.playerNames[3],
          flag: false,
          points: 0,
          playlist: myPlaylistDynamic4
        }

        people.push(person4);

        setPeople(people);



      }
      else {
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
      }

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
        //console.log("i", people[i].playlist);
        megaPlaylist = megaPlaylist.concat(people[i].playlist);
      }
      //console.log("MEGA PLAYLIST: ", megaPlaylist);
    
      for (let i = 0; i < numOfRounds; i++) {
        let song;
        let correctAnswer;
        //console.log(people);
       // console.log(curp)
        do {
          const index = Math.floor(Math.random() * megaPlaylist.length);
          song = megaPlaylist[index];
          correctAnswer = [];
    
          /* find the people who have that song */
          for (let j = 0; j < people.length; j++) {
            const curName = people[j].name;
            var curPlaylist = people[j].playlist;
            //console.log("cur playlist:"+ curPlaylist);
            //console.log("cur name:"+ curName);
            if (curPlaylist.includes(song)) {
              correctAnswer.push(curName);
            }
          }
        } while (song_bank.some((bankItem) => bankItem.song === song));
    
        const songInBank = {
          song: song, 
          correctAnswer: correctAnswer
        };
        //console.log("SONG ADDED TO BANK: ", songInBank);
    
        song_bank.push(songInBank);
      }
    

      //console.log("song_bank", song_bank);
      setSong_bank(song_bank);
    };
    

    useEffect(()=>{

      getSpotifyToken()
      if (spotifyToken) {
        console.log("spotify token got in song roulette game lobby ->", spotifyToken)
        // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)
        /* make song_bank data structure */
      
      }

      setButton( currentLobby && currentLobby.ownerID === user)
      
      
    }, [spotifyToken]);






    useEffect(() => {
      //socket.emit('fetch-lobbies');

      /*
      socket.on('update-lobbies', (updatedLobbies) => {
          setLobbies(updatedLobbies);
          //getCurrentLobby();
           setButton( currentLobby && currentLobby.ownerID === user)
          //setLobbyUsers(currentLobby.players);
      });
      */

      socket.on('owner-started-game',() => {
        console.log("owner started game!");
         //socket.emit('fetch-lobbies');
         getCurrentLobby();
         console.log(lobbies);
        if ( user  &&  currentLobby && currentLobby.length !=0 && user !== currentLobby.ownerID ) {
          /*
          
          //console.log(currentLobby.playerNames)
          //console.log(currentLobby.gameSongs)
          console.log(currentLobby)
          console.log(people)
          navigate("/songroulettegame", {
            state: {
              rounds: numOfRounds,
              people: people,
              song_bank: currentLobby.gameSongs,
              lobby: currentLobby
            },
          });

          */
         setIsReadyToStart(true);
         

          console.log("ready to start!")
        }
        else {
          console.log("not ready to start!");
          setIsReadyToStart(true);
        }
      });

      socket.on('lobby-deleted', (ownerID) => {
        if(currentLobby && currentLobby.ownerID !== ownerID){
          navigate("/songroulettelobbybrowser" , {
          state: {
          top5: top5arr
        },
      } );
        }
      });

      




      return () => {
        //socket.off('update-lobbies');
        //socket.off('owner-started-game');
      };
    }, []);;


    useEffect(() => {
      const handleUpdateLobbies = (updatedLobbies) => {
        console.log('Received Updated Lobbies:', updatedLobbies);
        //setLobbies((prevLobbies) => [...prevLobbies, ...updatedLobbies]);
        setLobbies(updatedLobbies);
        //isButtonDisabled = currentLobby && currentLobby.players && currentLobby.players.length ===4 && currentLobby.ownerID === user;
        if ( updatedLobbies && updatedLobbies[0]  && updatedLobbies[0].peopleGame && updatedLobbies[0].peopleGame.length == 4 && updatedLobbies[0].gameType) {
          navigate("/songroulettegame", {
            state: {
              rounds: updatedLobbies[0].rounds,
              people: updatedLobbies[0].peopleGame,
              song_bank: updatedLobbies[0].gameSongs,
              lobby: updatedLobbies[0]
            
            },
          });
          
        }
        
        
      };

      socket.emit('fetch-lobbies');
      

      socket.on('update-lobbies', handleUpdateLobbies);

        return () => {
          // Clean up the socket event listener when the component unmounts
          if(currentLobby)
          socket.off('update-lobbies', handleUpdateLobbies);
        };
    }, []);



    useEffect(()=>{

      getCurrentLobby();
      setButton( currentLobby && currentLobby.ownerID === user)
      

    }, [user]);


    useEffect(() => {
      setIsButtonDisabled(
        !(currentLobby &&
        currentLobby.players &&
        currentLobby.players.length === 4 &&
        currentLobby.ownerID === user)
      );
    }, [currentLobby, user]);



  const divStyleLobbuy = {
    color: 'black',
    fontSize: 25,
  };

    





    

    //setButton( currentLobby && currentLobby.ownerID === user);
    //var isButtonDisabled = currentLobby && currentLobby.players && currentLobby.players.length ===4 && currentLobby.ownerID === user;




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
              color: theme.palette.secondary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "450px",
              width: "100%",
              backgroundColor: theme.palette.background.default
            }}
            >
              <CardContent>
                <Typography variant="h3" component="div">
                  Game Lobby
                </Typography>

                <ul>
                {lobbies.map((lobby) => (
                <li style={divStyleLobbuy} key={lobby.code}>
                (Players: {lobby.playerNames.join(', ')})
                </li>
                ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              color: theme.palette.secondary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "450px",
              width: "100%",
              backgroundColor: theme.palette.background.default
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
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.secondary.main,
            textTransform: "none",
            fontSize: 15,
            fontWeight: "bold",
            margin: "3%"
          }}
          onClick={startgame_click}
         disabled={isButtonDisabled}
        >
          Start Game!
        </Button>
        <div> {/* Button to delete lobby */}
        {/* Button to delete lobby */}
        <button onClick={() => deleteLobby()}
         disabled={isButtonDisabledOwner}
         >Delete Lobby</button>
        {/* Button to leave lobby */}
        <button onClick={() => deleteLobby()}
        disabled={true}
        >Leave Lobby</button>
        </div>
        <ul>
          { /*lobbyUsers.map((player, index) => (
            <li key={index}>{player}</li>
          )) */}
        </ul>





        </div>
      );
    }
  

export default SongRouletteLobby;
