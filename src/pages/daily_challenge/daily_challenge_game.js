import Button from "@mui/material/Button";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from "@mui/material/TextField";
import { useTheme } from '@mui/material/styles';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { UserContext } from "../../App";


function DailyChallengeGame() {

    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token


    const gameMode = location.state.gameMode;
    const songInfo = location.state.songInfo
    console.log("GAME MODE = " + gameMode)
    console.log("SONG INFO = ", songInfo)
    // 0 = previewURL, 1 = artistName, 2 = album cover, 3 = song name

    // temp hardcoded song for iframe display
    const songName = songInfo[3];
    const songArtist = songInfo[1];
    const songAlbumPic = songInfo[2];
    const songAudio = songInfo[0];

    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);

    const revealHint1 = () => {
        setShowHint1(true);
      };
    
      const revealHint2 = () => {
        setShowHint2(true);
      };

    /* Navigation for buttons */
    const navigate = useNavigate();

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/dailychallengelobby");
    };

    const [isDialogOpen, setDialogOpen] = useState(false);

    const originalWindowWidth = window.innerWidth; // store the original window width

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= originalWindowWidth) {
            setDialogOpen(true);
          } else {
            setDialogOpen(false);
          }
        };
    
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [originalWindowWidth]);
    
      const closeDialog = () => {
        setDialogOpen(false);
      };
    
    return (

        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>


        <Typography variant="h3" style={{ textAlign: "center"}}>
            Guess the song!
        </Typography>
        <br></br>

        <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
          {/* Cancel Icon */}
          <CancelIcon
                style={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: '15px',
                right: '15px',
                height: '40px',
                width: '40px',
                cursor: 'pointer',
                zIndex: 1, 
                }}
                onClick={() => exitgame_click()} 
            />
            <br></br>
            <br></br>
            <br></br>
          <CardContent>

            <div
              style={{
                position: 'relative',
                border: `2px solid ${theme.palette.background.default}`,
                borderRadius: '12px',
                backgroundColor: '#282828',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '15px',
                maxWidth: '1100px', 
                margin: '0 auto',
              }}
            >
              {/* Album Cover */}
              <img
                src={songAlbumPic}
                alt="Album Cover"
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '12px',
                  marginRight: '16px',
                }}
              />

          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginLeft: '1%'
              }}
            >
              {/* Song Name */}
              <Typography variant="h3" style={{ color: 'white', marginBottom: "2%" }}>{songName}</Typography>

              {/* Artist */}
              <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songArtist}</Typography>

              {/* Audio Preview */}
              <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                <source src={songAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            </div>

          </CardContent>
        </Card>
            
        <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
            {/* Cancel Icon */}
          <CancelIcon
                style={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: '15px',
                right: '15px',
                height: '40px',
                width: '40px',
                cursor: 'pointer',
                zIndex: 1, 
                }}
                onClick={() => exitgame_click()} 
            />
            
            <CardContent>
            <br></br>
            <br></br>
            <br></br>

            {(!showHint1 && !showHint2) && (
            <div
              style={{
                position: 'relative',
                border: `2px solid ${theme.palette.background.default}`,
                borderRadius: '12px',
                backgroundColor: '#282828',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '15px',
                maxWidth: '1100px', 
                margin: '0 auto',
              }}
            >
              {/* Album Cover */}
              <div
              style={{
                width: '180px',
                height: '180px',
                background: 'black', 
                borderRadius: '12px',
                marginRight: '16px',
              }}
            ></div>

          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginLeft: '1%'
              }}
            >
              {/* Song Name */}
              <div
              style={{
                width: '880px', // Adjust the width as needed
                height: '34px', // Adjust the height as needed
                background: 'black', // Replace with your desired background color
                marginBottom: "2%",
                borderRadius: '12px'
              }}
            ></div>

              {/* Artist */}
              <div
              style={{
                width: '880px', // Adjust the width as needed
                height: '20px', // Adjust the height as needed
                background: 'black', // Replace with your desired background color
                marginBottom: "2%",
                borderRadius: '12px'
              }}
            ></div>

              {/* Audio Preview */}
              <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                <source src={songAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            </div>
            )}


            {/* STAGE 2 - 1 HINT (+ ARTIST NAME(S)) - only easy mode */}
            {showHint1 && !showHint2 && (
              <div
              style={{
                position: 'relative',
                border: `2px solid ${theme.palette.background.default}`,
                borderRadius: '12px',
                backgroundColor: '#282828',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '15px',
                maxWidth: '1100px', 
                margin: '0 auto',
              }}
            >
              {/* Album Cover */}
              <div
              style={{
                width: '180px',
                height: '180px',
                background: 'black', 
                borderRadius: '12px',
                marginRight: '16px',
              }}
            ></div>

          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginLeft: '1%',
                borderRadius: '12px'
              }}
            >
              {/* Song Name */}
              <div
              style={{
                width: '880px', 
                height: '34px', 
                background: 'black', 
                marginBottom: "2%",
                borderRadius: '12px'
              }}
            ></div>

              {/* Artist */}
              <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songArtist}</Typography>

              {/* Audio Preview */}
              <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                <source src={songAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            </div>
            )}

            {/* STAGE 3 - 2 HINTs (+ ALBUM COVER) - only easy mode */}
            {showHint2 && (
            <div
            style={{
              position: 'relative',
              border: `2px solid ${theme.palette.background.default}`,
              borderRadius: '12px',
              backgroundColor: '#282828',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '15px',
              maxWidth: '1100px', 
              margin: '0 auto',
            }}
          >
            {/* Album Cover */}
            <img
              src={songAlbumPic}
              alt="Album Cover"
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '12px',
                marginRight: '16px',
              }}
            />

        <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: '1%'
            }}
          >
            {/* Song Name */}
            <div
              style={{
                width: '880px', 
                height: '34px', 
                background: 'black', 
                marginBottom: "2%",
                borderRadius: '12px'
              }}
            ></div>

            {/* Artist */}
            <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songArtist}</Typography>

            {/* Audio Preview */}
            <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
              <source src={songAudio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          </div>
            )}

        <br></br>
        <br></br>
        <br></br>

        
        {/* Button to reveal hint 1 */}
          {gameMode === "Easy" && !showHint1 && (
            <Button variant="contained"
              style={{
                width: 230,
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: "-3%",
                marginBottom: "3%"
              }}
              onClick={revealHint1}>
              Reveal Hint 1 🧨
            </Button>
          )}

          {/* Button to reveal hint 2 */}
          {gameMode === "Easy" && showHint1 && !showHint2 && (
            <Button variant="contained"
              style={{
                width: 230,
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: "-3%",
                marginBottom: "3%"
              }}
              onClick={revealHint2}>
              Reveal Hint 2 🧨
            </Button>
          )}  

          <br></br>

          {/* Text field for answer */}  
          <TextField
            label="Your Answer"
            style={{ width: "50%" }}
            InputProps={{ style: { color: theme.palette.primary.main } }} 
            InputLabelProps={{ style: { color: theme.palette.primary.main } }} 
        />

            </CardContent>
        </Card>
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
        Submit
        </Button>

        </div>
    );
}

export default DailyChallengeGame;
