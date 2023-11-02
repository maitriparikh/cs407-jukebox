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
import ButtonGroup from '@mui/material/ButtonGroup';

import { useTheme } from '@mui/material/styles';

function DailyChallengeLobby() {

    const theme = useTheme();

    const [numOfRounds, setNumOfRounds] = useState("");

    const [gameMode, setGameMode] = useState("Easy");
    // verifying that default daily challenge game mode is "Easy" if nothing is selected
    console.log("Daily Challenge Game Mode: ", gameMode);

    const modeSelection = (mode) => {
        setGameMode(mode);
    };

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Daily Challenge
        </Typography>

        <br></br>

        <Card 
            style={{ 
            height: "270px", 
            border: `3px solid ${theme.palette.primary.main}`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "85%", 
            margin: "0 auto", 
            backgroundColor: theme.palette.background.default
            }}
        >

        <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", paddingBottom: "50px", paddingLeft: "100px", paddingRight: "100px" }}>
            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                {/* Daily challenge game instructions - update as needed */}
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: "16px" }}>
                    Welcome to Jukebox's daily challenge! Your task will be to guess a particular song with as few hints as possible. First, choose a game mode below. 
                </Typography>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    In easy mode, we will start you off with an an audio snippet from the mystery song. If you recognize the tune, enter it in the box that appears on your screen. If you can't, don't worry - we will continue giving you more hints (visual, lyrical, trivia-y, etc). For hard mode, you must guess the song from the audio snippet alone! Good luck!
                </Typography>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: "25px" }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button 
                    variant={gameMode === "Easy" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115, 
                        color: "black",
                        backgroundColor: gameMode === "Easy" ? "var(--line-color)" : "var(--accent-color)", 
                        border: `1px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Easy")}>
                        Easy
                    </Button>
                    <Button 
                    variant={gameMode === "Hard" ? "contained" : "outlined"} 
                    style={{ 
                        width: 115, 
                        color: "black", 
                        backgroundColor: gameMode === "Hard" ? "var(--line-color)" : "var(--accent-color)", 
                        border: `1px solid ${theme.palette.primary.main}`,
                        textTransform: "none", 
                        fontSize: 15, 
                        fontWeight: "bold" 
                    }} 
                    onClick={() => modeSelection("Hard")}>
                        Hard
                    </Button>
                </ButtonGroup>
            </Grid>
            </CardContent>
            </Card>

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
                >
                Start Game!
                </Button>
            </Grid>
   
        </div>
      );
    }
    

export default DailyChallengeLobby;