import React, { useState, useEffect } from "react";
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

function SongRouletteLobby() {

    /* Navigation for buttons */
    const navigate = useNavigate();

    const [numOfRounds, setNumOfRounds] = useState(3);
    const [people, setPeople] = useState([
      {
          name: "Shreya",
          flag: false,
          points: 0
      },
      {
          name: "Sean",
          flag: false,
          points: 0
      },
      {
          name: "Maitri",
          flag: false,
          points: 0
      },
      {
          name: "Francisco",
          flag: false,
          points: 0
      },
      {
          name: "Purdue Pete",
          flag: false,
          points: 0
      },
      {
          name: "Devin",
          flag: false,
          points: 0
      },
    ])
    const [song_bank, setSong_bank] = useState([ 
      {
          song: "https://open.spotify.com/embed/track/6rdkCkjk6D12xRpdMXy0I2?utm_source=generator",
          correctAnswer: ["Shreya", "Purdue Pete"]
      },
      {
          song: "https://open.spotify.com/embed/track/5QO79kh1waicV47BqGRL3g?utm_source=generator",
          correctAnswer: ["Francisco"]
      },
      {
          song: "https://open.spotify.com/embed/track/5zsHmE2gO3RefVsPyw2e3T?utm_source=generator",
          correctAnswer: ["Shreya", "Maitri"]
      },
      {
          song: "https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator",
          correctAnswer: ["Maitri"]
      },
      {
          song: "https://open.spotify.com/embed/track/0pqnGHJpmpxLKifKRmU6WP?utm_source=generator",
          correctAnswer: ["Sean"]
      },
      {
          song: "https://open.spotify.com/embed/track/5HrIcZOo1DysX53qDRlRnt?utm_source=generator",
          correctAnswer: ["Francisco", "Shreya", "Sean", "Maitri"]
      },
      {
          song: "https://open.spotify.com/embed/track/6DCZcSspjsKoFjzjrWoCdn?utm_source=generator",
          correctAnswer: ["Francisco", "Devin"]
      },
      {
          song: "https://open.spotify.com/embed/track/39MK3d3fonIP8Mz9oHCTBB?utm_source=generator",
          correctAnswer: ["Purdue Pete", "Devin"]
      },
      {
          song: "https://open.spotify.com/embed/track/0nbXyq5TXYPCO7pr3N8S4I?utm_source=generator",
          correctAnswer: ["Sean", "Maitri"]
      },
      {
          song: "https://open.spotify.com/embed/track/10eBRyImhfqVvkiVEGf0N0?utm_source=generator",
          correctAnswer: ["Shreya", "Francisco", "Maitri", "Sean", "Devin", "Purdue Pete"]
      }
    ])

    const startgame_click = () => {
      console.log("START GAME CLICKED");
      navigate("/songroulettegame", {
        state: {
          rounds: numOfRounds,
          people: people,
          song_bank: song_bank
        },
      });
    };

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

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