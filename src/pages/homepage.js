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

function Homepage() {

    const navigate = useNavigate();

    const gameCardHover = {
      transition: "transform 0.2s", 
      "&:hover": {
        transform: "scale(1.05)", 
      },
  };

    // to track which game is selected
    const [game, setChosenGame] = useState('');

    // for a random game selection
    const gameNames = [
      "Daily Challenge",
      "Song Roulette",
      "Pictionary",
      "Song Snippet",
      "Trivia Challenge",
      "Lyric Challenge",
    ];

    const chooseGame = (game) => {
      // random button clicked
      if (game == "Random") {
        // generate a random number from 0-5 (array indices corresponding to games in gameNames array)
        console.log('Random Game Chosen!');
        const num = Math.floor(Math.random() * 6);
        game = gameNames[num];
      }
      console.log('Game Chosen:', game);
      setChosenGame(game);
      if (game == "Song Roulette") {
        navigate("/songroulettelobby");
      } 
      else if (game == "Daily Challenge") {
        navigate("/dailychallengelobby");
      } else if (game == "Pictionary") {
        navigate("/pictionarylobby");
      } else if (game == "Song Snippet") {
        navigate("/songsnippetlobby");
      } else if (game == "Trivia Challenge") {
        navigate("/triviachallengelobby");
      } else if (game == "Lyric Challenge") {
        navigate("/lyricchallengelobby");
      } 
    }

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h1" style={{ textAlign: "center" }}>
            Homepage
        </Typography>

        <br></br>

        <Button
          sx={{
            width: "15%",
            marginBottom: "20px",
            color: "var(--text-color)",
            border: `2px solid var(--text-color)`,
            transition: "border-color 0.3s, background-color 0.3s",
            backgroundColor: "var(--accent-color)",
            textTransform: "none",
            fontSize: 20,
            fontWeight: "bold",
            position: "relative",
            "&:hover": {
              animation: "flash 1s infinite", 
            },
            "@keyframes flash": {
              "0%": {
                backgroundColor: "var(--accent-color)",
              },
              "50%": {
                backgroundColor: "var(--line-color)",
              },
              "100%": {
                backgroundColor: "var(--accent-color)",
              },
            },
            
          }}
          onClick={() => chooseGame("Random")}
        >
          Random 🔀
        </Button>
        <br></br>
        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Daily Challenge")}
            >
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Daily Challenge
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Song Roulette")}>
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Song Roulette 👥
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Pictionary")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Pictionary 👥
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
    
          {/* Second Row */}
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Song Snippet")}>
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Song Snippet
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Trivia Challenge")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Trivia Challenge
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: "var(--accent-color)",
              color: "var(--text-color)",
              border: `2px solid var(--text-color)`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Lyric Challenge")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Lyric Challenge
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </div>
      );
    }
    

export default Homepage;