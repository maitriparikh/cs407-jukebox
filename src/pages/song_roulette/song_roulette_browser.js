import React, { useState, useEffect, createContext, useContext } from "react";
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
import io from "socket.io-client";
import LobbyViewer from "./song_roulette_lobby_viewer";
import { UserContext } from "../../App";

import { db } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";




//import handleCreateLobby from "../../server"
const socket = io('http://localhost:3001');


function generateUserID() {


  const timestamp = new Date().getTime().toString();
  const randomSuffix = Math.floor(Math.random() * 1000).toString(); // Add some randomness
 
  return timestamp + randomSuffix;
}

function SongRouletteLobbyBrowser() {

  const { user, setUser } = useContext(UserContext);
  const [creatingLobby, setCreatingLobby] = useState(false);
  const [message, setMessage] = useState('');
  const [lobbies, setLobbies] = useState([]);
  const [userID, setUserID] = useState(null);
  const [owner, setOwner] = useState(null); // Store the owner of the lobby
  const [roomCode, setRoomCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
  const [userNameTemp2, setUserNameTemp2] = useState("");



  /* Navigation for buttons */
  const navigate = useNavigate();

  const startLobby_click = () => {
    if (!creatingLobby) {
      setCreatingLobby(true); // Disable the button temporarily
      socket.emit('create-lobby', { userID });
      setMessage('Creating a new lobby...');
    }
  };

  
  const getSpotifyToken = async () => {
    const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
      setSpotifyToken(doc.data().spotifyToken);
      setUserNameTemp2(doc.data().username);
      //userNameTemp = doc.data().username;
      console.log('username is:' + userNameTemp2);
    });
  };

  


  const handleJoinRoom = () => {
    if (roomCode.trim() === "") {
      setJoinError("Room code cannot be empty");
      return;
    }

    // Emit a socket event to join the lobby with the roomCode
    socket.emit('join-lobby', roomCode);

    // Reset the room code input
    setRoomCode("");
  };


    const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
    setJoinError("");
  };

  


  
const changeID = (id) => {
    // Check if the user is the owner before allowing them to join
  
      socket.emit('set-user-id', id);
  };

    const [numOfRounds, setNumOfRounds] = useState("");

    const handleCreateLobby = () => {
      if (!creatingLobby) {
        setCreatingLobby(true); // Disable the button temporarily
        setUserID(user);

        changeID(user);

        socket.emit('create-lobby', userID, userNameTemp2 );
        setMessage('Creating a new lobby...');
        //navigate("/songroulettelobby");
        navigate('/songroulettelobby', { state: { 1: lobbies.players } });
      }
    };

    const handleRefresh = () => {
      if (!creatingLobby) {
        //setCreatingLobby(true); // Disable the button temporarily
        socket.emit('update-lobbies', {});
        //setMessage('Creating a new lobby...');
        //navigate("/songroulettelobby");
      }
    };


    useEffect(() => {
      const generatedUserID = generateUserID();
      
      setUserID(user);
      console.log( 'testing id',user)

      socket.emit('fetch-lobbies', { userID });

      socket.on('update-lobbies', (updatedLobbies) => {
        setLobbies(updatedLobbies);
      });

      socket.emit('set-user-id', user);

      // Clean up the listener when the component unmounts
      return () => {
        socket.off('update-lobbies');
      };
  }, []);

  socket.on('lobby-created', (code, lobbyOwnerID) => {
    setMessage('Lobby created with code: ${code}');
    setCreatingLobby(false);

    

    // Set the owner when the lobby is created
    if (userID === lobbyOwnerID) {
      setOwner(lobbyOwnerID);
    }
  });

   socket.on('lobby-joined', (lobbyCode, userID) => {
      console.log("tryin to join a lobby");
      setMessage('Joined lobby with code: ${lobbyCode}');
      //socket.emit('message', 1);
      navigate('/songroulettelobby/'); // Navigate to the lobby page
  });

  socket.on('lobby-error', (error) => {
    setMessage('Error: ${error}');
    setCreatingLobby(false);
  });

  
  useEffect(()=>{

      getSpotifyToken()
      if (spotifyToken) {
        console.log("spotify token got in song roulette game lobby ->", spotifyToken)
        // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)
        /* make song_bank data structure */
      
      }
      
      
    }, [spotifyToken]);

    const canCreateLobby = lobbies.length === 0;

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h1" style={{ textAlign: "center" }}>
            Song Roulette
        </Typography>

        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={8}>
            <Card elevation={3} sx={{
              color: "var(--text-color)",
              border: '2px solid var(--text-color)',
              borderRadius: "8px",
              height: "450px",
              width: "100%",
            }}
            >
              <CardContent>
                <Typography variant="h3" component="div">
                  Game Lobbies

                </Typography>
              </CardContent>

            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              color: "var(--text-color)",
              border: '2px solid var(--text-color)',
              borderRadius: "8px",
              height: "450px",
              width: "100%",
            }}
            >

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
          //onClick={startgame_click}
        >
          Join Lobby
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
          //onClick={handleCreateLobby} disabled={creatingLobby}
        >
          Create Lobby
        </Button>

        <div><TextField
        label="Room Code"
        variant="outlined"
        fullWidth
        value={roomCode}
        onChange={handleRoomCodeChange}
        error={Boolean(joinError)}
        helperText={joinError}
      />
      
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
        onClick={handleJoinRoom}
      >
        Join Room
      </Button></div>

    <div>
      <button onClick={handleCreateLobby}disabled={creatingLobby || owner === userID || !canCreateLobby}>
        Create Lobby
      </button>

      
      <p>{message}</p>
      <LobbyViewer lobbies={lobbies} userID={userID} owner={owner}  />
    </div>
    

    <button onClick={handleRefresh}>
       refresh
      </button>
      
        </div>
        
        
        
      );
    }
    

export default SongRouletteLobbyBrowser;