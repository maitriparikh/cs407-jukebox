
const express = require('express');

const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app2 = express();
app2.use(cors());

const server = http.createServer(app2);
const io = socketIo(server, {cors: {origin: "*"}});

const PORT =3001;
var count = 0;

var lobbies = new Map();

app2.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

let lobbyExists = false;
let id;
let selectedGameType;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => {
    //console.log('new client connected');

    // Generate a unique userID and send it to the client

    id = 0;
    socket.on('set-user-id', (val) => {
      id = val;
    });

    selectedGameType = 'none';
    socket.on('set-selectedGameType', (val) => {
      selectedGameType = val;
    });




    let userID = id;
    socket.on('fetch-lobbies', () => {
        const lobbyData = Array.from(lobbies.values());
        //console.log(lobbyData);
        //console.log("^^^ lobby data ^^^");
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
        socket.emit('update-lobbies', lobbyData);
    });

    socket.on('create-lobby', (userID, userNameTemp, top5arr) => {
      if (lobbyExists) {
          socket.emit('lobby-error', 'A lobby already exists.');
          return;
      }

      console.log("lobby creation started");
      console.log("username of user creating lobby:" + userNameTemp);
      const lobbyCode = generateUniqueLobbyCode();
      console.log('created lobby code:' + lobbyCode);
      socket.join(lobbyCode);
      const lobbyDetails = {
        code: lobbyCode,
        ownerID: id, // The owner is the user who created the lobby
        players: [id], // Include the owner in the players list
        gameType: selectedGameType,
        gameData:[top5arr],
        playerNames: [],
        points: [0,0,0,0],
        rounds: 0,
        gameSongs: [],
        peopleGame:[]
      };
      lobbies.set(lobbyCode, lobbyDetails);
      io.to(lobbyCode).emit('lobby-created', lobbyCode, socket.userID);
      console.log("lobby created");
      lobbyDetails.playerNames.push(userNameTemp);
      console.log("lobbies following...");
      console.log(lobbies);
  
      

      updateLobbies();

      lobbyExists = true;
    });
    socket.on('join-lobby', (lobbyCode, userNameTemp,top5arr2) => {
      // Handle joining a lobby
      if (isLobbyValid(lobbyCode)) {
        socket.join(lobbyCode);
        const lobbyDetails = lobbies.get(lobbyCode);

        // Add the user to the lobby's players array
        lobbyDetails.players.push(id);
        console.log('passed username:' + userNameTemp);
        console.log('passed lobby code:' + lobbyCode);
        lobbyDetails.playerNames.push(userNameTemp);
        lobbyDetails.gameData.push(top5arr2);


        console.log(lobbies);

        socket.emit('lobby-joined', lobbyCode);

        // Update the list of lobbies for all clients
        updateLobbies();
      } else {
        socket.emit('lobby-error', 'Invalid lobby code');
        console.log('error with joining lobby!');
      }
    });

  socket.on('game-started', (ownerId, song_bank, numOfRounds,people) => {
  // Finding the lobby associated with the provided ownerId
  for (const [lobbyCode, lobbyDetails] of lobbies.entries()) {
    if (lobbyDetails.ownerID === ownerId) {
      // Update details in the found lobby associated with the ownerID
      lobbyDetails.rounds = numOfRounds;
      
      // Ensure song_bank is an array, or push its contents individually
      if (Array.isArray(song_bank)) {
        lobbyDetails.gameSongs = lobbyDetails.gameSongs.concat(song_bank);
      } else {
        lobbyDetails.gameSongs.push(song_bank);
        
      }
      lobbyDetails.peopleGame.push(people);

     
      
      updateLobbies();
       //updateLobbies();
        //updateLobbies();
         //updateLobbies();
          //updateLobbies();
           //updateLobbies();
            //updateLobbies();
             //updateLobbies();
      //console.log(lobbies);
      io.emit('owner-started-game');
      break; // Exit loop after updating the lobby details
    }
  }
});


    const removeLobbyByOwnerID = (ownerID) => {
      const updatedLobbiesTemp = new Map(lobbies); // Create a copy of the lobbies map

      // Iterate through the map and find the lobby with the specified ownerID
      for (const [lobbyCode, lobbyDetails] of updatedLobbiesTemp) {
        if (lobbyDetails.ownerID === ownerID) {
          updatedLobbiesTemp.delete(lobbyCode); // Remove the lobby with the matching ownerID
          break; // Assuming there is only one lobby per ownerID, break after finding it
        }
      }
      //console.log(lobbies);
      //console.log("test1");
      lobbies = updatedLobbiesTemp;
      console.log(lobbies);
   }




    socket.on('delete-lobby', (ownerID) => {
      /*
      for (const [lobbyOwnerID, lobby] of lobbies) {
        if (lobbyOwnerID === ownerID) {
          lobbies.delete(lobbyOwnerID);
          io.emit('update-lobbies', Array.from(lobbies.values()));
          break;
        }
      }
      */

      console.log("owner ID:" + ownerID);
      removeLobbyByOwnerID(ownerID);
      console.log(lobbies);

      lobbyExists = false;
      io.emit('lobby-deleted', ownerID);
      io.emit('update-lobbies', Array.from(lobbies.values()));
    });

socket.on('leave-lobby', ({ user, ownerID }) => {
  const lobby = lobbies.get(0);

  if (lobby) {
    const index = lobby.players.indexOf(user);
    if (index !== -1) {
      lobby.players.splice(index, 1);
      lobbies.set(ownerID, lobby);

      // Emit the updated lobby data to all users in the lobby except the user who left

      //io.emit('lobby-deleted', ownerID);
      io.emit('update-lobby', lobby);
      
    }
  }
  else{
    console.log("test");
  }
});

    
socket.on('update-user-points', ({ lobbyCode, updatedPeople }) => {

      console.log("huh?")
      const lobby = lobbies.get(0);

      // Update scores for existing users
      lobby.peopleGame.forEach((user, index) => {
        const updatedUser = updatedPeople.find(updated => updated.name === user.name);

        if (updatedUser) {
          lobby.peopleGame[0][index].points += updatedUser.points;
                  console.log("test1: " + updatedUser);
        }
        else("hmmm2")
      });

      lobbies.set(lobbyCode, lobby);

      // Emit the updated lobby data to all clients in that lobby

      io.emit('update-lobbies', Array.from(lobbies.values()));
      // Broadcast the updated lobbies to all clients
      updateLobbies();
      updateLobbies();
      updateLobbies();
      updateLobbies();
      updateLobbies();
      updateLobbies();

});


    

    socket.on('disconnect', () => {
      //console.log('A user disconnected');

      const rooms = socket.rooms;
      rooms.forEach((room) => {
        if (lobbies.has(room)) {
          const lobbyDetails = lobbies.get(room);
          lobbyDetails.players -= 1;

          // Remove the lobby if there are no players
          if (lobbyDetails.players <= 0) {
            lobbies.delete(room);
          }

          // Update the list of lobbies for all clients
          updateLobbies();
        }
      });

    // Update the list of lobbies when a user disconnects
    updateLobbies();
  });

  function updateLobbies() {
 // Get the list of lobbies with their details (e.g., number of players)

    const updatedLobbies = Array.from(lobbies.values());
    //console.log("updated lobbies following");
    //console.log(updatedLobbies);

    // Emit the updated list to all connected clients
    io.emit('update-lobbies', updatedLobbies);
  }

    

});



/**
 * @description This methos retirves the static channels
 */
app2.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});


function generateUniqueUserID() {


    return 'user_' + Math.random().toString(36).substr(2, 9); // Generate a random unique userID
}

function generateUniqueLobbyCode() {
    return count++;
}

function isLobbyValid(lobbyCode) {
  // Check if the lobby code exists and is valid
  // TODOD: CHANGE THIS old way didnt work
  return true;
}