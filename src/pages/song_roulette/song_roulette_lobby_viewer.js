import React, { useState, useEffect, createContext, useContext } from "react";
import io from 'socket.io-client';
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";


const socket = io('http://localhost:3001'); // Replace with your server URL

function LobbyViewer() {
  const { user, setUser } = useContext(UserContext);
  const [lobbies, setLobbies] = useState([]);
  const [joiningLobby, setJoiningLobby] = useState(null);
  const [lobbyCode, setLobbyCode] = useState("");
  
  const navigate = useNavigate();
  let userID
  console.log("user id is :", user);

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
      setJoiningLobby(lobbyCode);
      socket.emit('set-user-id', user);
      socket.emit('join-lobby', lobbyCode);
      console.log(lobbies);
      navigate("/songroulettelobby");
      
    }
    else {
      console.log("something went wrong!")
    }
  };

  return (
 <div>
      <h2>Lobby Viewer</h2>
      
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby.code}>
           Lobby Code: {lobby.code} (Players: {lobby.players.join(', ')})
            <button
              onClick={() => handleJoinLobby(lobby.code, lobby.ownerID)}
              disabled={joiningLobby === lobby.code || lobby.ownerID === user}
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
