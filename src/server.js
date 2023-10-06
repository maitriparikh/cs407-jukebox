
const express = require('express');

const http = require('http');
const socketIo = require('socket.io');

const app2 = express();
const server = http.createServer(app2);
const io = socketIo(server);

const PORT =3001;
var count = 0;

const lobbies = new Map();

app2.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

let lobbyExists = false;
let id;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => {
    console.log('new client connected');

    // Generate a unique userID and send it to the client

    id = 0;
    socket.on('set-user-id', (val) => {
      id = val;
    });




    let userID = id;
    socket.on('fetch-lobbies', () => {
        const lobbyData = Array.from(lobbies.values());
        socket.emit('update-lobbies', lobbyData);
    });

    socket.on('create-lobby', (lobbyData, userID) => {
      if (lobbyExists) {
          socket.emit('lobby-error', 'A lobby already exists.');
          return;
      }

      console.log("lobby creation started");
      const lobbyCode = generateUniqueLobbyCode();
      socket.join(lobbyCode);
      const lobbyDetails = {
        code: lobbyCode,
        ownerID: id, // The owner is the user who created the lobby
        players: [id], // Include the owner in the players list
      };
      lobbies.set(lobbyCode, lobbyDetails);
      io.to(lobbyCode).emit('lobby-created', lobbyCode, socket.userID);
      console.log("lobby created");
      console.log(lobbies);
      

      updateLobbies();

      lobbyExists = true;
    });
    socket.on('join-lobby', (lobbyCode) => {
      // Handle joining a lobby
      if (isLobbyValid(lobbyCode)) {
        socket.join(lobbyCode);
        const lobbyDetails = lobbies.get(lobbyCode);

        // Add the user to the lobby's players array
        lobbyDetails.players.push(id);

        console.log(lobbies);

        socket.emit('lobby-joined', lobbyCode);

        // Update the list of lobbies for all clients
        updateLobbies();
      } else {
        socket.emit('lobby-error', 'Invalid lobby code');
        console.log('error with joining lobby!');
      }
    });


  socket.on('disconnect', () => {
    console.log('A user disconnected');

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
    /*
    const updatedLobbies = Array.from(io.sockets.adapter.rooms.keys()).map((lobbyCode) => ({
      code: lobbyCode,
      players: io.sockets.adapter.rooms.get(lobbyCode).size || 0,
    }));

    // Emit the updated list to all connected clients
    io.emit('update-lobbies', updatedLobbies);
  }
  */
    const updatedLobbies = Array.from(lobbies.values());

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