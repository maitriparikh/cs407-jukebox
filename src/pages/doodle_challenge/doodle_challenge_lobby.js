import React, { useState, useContext, useEffect } from "react";
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
import { UserContext } from "../../App";

import { useTheme } from '@mui/material/styles';

import StartGameSound from "../../sounds/start_game.mp3";

function DoodleChallengeLobby() {

   const theme = useTheme();

   const { user, setUser } = useContext(UserContext);

   const navigate = useNavigate();
   const [numOfRounds, setNumOfRounds] = useState("");


    const startgame_click = async () => {
      console.log("START GAME CLICKED");
      const audio = new Audio(StartGameSound);
      audio.play();
      navigate("/doodlechallengegame", {
      });
    };

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Doodle Challenge
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
                    InputProps={{ style: { color: theme.palette.primary.main } }} 
                    InputLabelProps={{ style: { color: theme.palette.primary.main } }} 
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
        >
          Start Game!
        </Button>
        
        </div>
      );
    }
    

export default DoodleChallengeLobby;