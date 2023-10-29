import React, { useState, useEffect, createContext, useContext } from "react";
import io from 'socket.io-client';
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";



const socket = io('http://localhost:3001'); // Replace with your server URL

function LobbyViewer() {
  const { user, setUser } = useContext(UserContext);
  const [lobbies, setLobbies] = useState([]);
  const [joiningLobby, setJoiningLobby] = useState(null);
  const [lobbyCode, setLobbyCode] = useState("");
  const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token

  const [userNameTemp, setUserNameTemp] = useState("");

  

  
  const navigate = useNavigate();
  let userID
  //console.log("user id is :", user);

  //let userNameTemp = "temp";

  const getSpotifyToken = async () => {
    const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
      setSpotifyToken(doc.data().spotifyToken);
      setUserNameTemp(doc.data().username);
      //userNameTemp = doc.data().username;
      console.log('username is:' + userNameTemp);
    });
  };

  


  useEffect(() => {
    socket.emit('fetch-lobbies');

    socket.on('update-lobbies', (updatedLobbies) => {
        setLobbies(updatedLobbies);
    });
    return () => {
      socket.off('update-lobbies');
    };
  }, []);;

  const handleJoinLobby = (lobbyCode, ownerID) => {
    // Check if the user is the owner before allowing them to join
    if (joiningLobby === null && ownerID !== user ) {

      //const [lobbyUsers, setLobbyUsers] = useState([]);




      setJoiningLobby(lobbyCode);
      socket.emit('set-user-id', user);
      socket.emit('join-lobby', lobbyCode, userNameTemp );
      console.log(lobbies);
      navigate("/songroulettelobby");
      
    }
    else {
      console.log("something went wrong!")
    }
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
 <div>
      <h2>Lobby Viewer</h2>
      
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby.code}>
           Lobby Code: {lobby.code} (Players: {lobby.playerNames.join(', ')})
            <button
              onClick={() => handleJoinLobby(lobby.code, lobby.ownerID)}
              disabled={joiningLobby === lobby.code || lobby.ownerID === user || lobby.players.includes(user) }
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>


  );
}

export default LobbyViewer;
