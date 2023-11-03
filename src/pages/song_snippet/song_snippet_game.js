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
import Autocomplete from '@mui/material/Autocomplete';



function SongSnippetLobby() {

    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token

    const [answer, setAnswer] = useState("");

    const gameMode = location.state.gameMode;
    const songInfo = location.state.songInfo
    const allSongs = location.state.allSongs
    console.log("GAME MODE = " + gameMode)
    console.log("SONG INFO = ", songInfo)
    console.log("ALL SONGS = ", allSongs)
    // 0 = previewURL, 1 = artistName, 2 = album cover, 3 = song name

    // temp hardcoded song for iframe display
    const songName = songInfo[3];
    const songArtist = songInfo[1];
    const songAlbumPic = songInfo[2];
    const songAudio = songInfo[0];

    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);

    const hint1Delay = 10000; // 10 seconds
    const hint2Delay = 20000; // 20 seconds

    const [canRevealHint1, setCanRevealHint1] = useState(false);
    const [canRevealHint2, setCanRevealHint2] = useState(false);

    const [hint1Revealed, setHint1Revealed] = useState(false);

    const [hint1Countdown, setHint1Countdown] = useState(hint1Delay / 1000);
    const [hint2Countdown, setHint2Countdown] = useState(hint2Delay / 1000);

    useEffect(() => {
      const hint1Timer = setInterval(() => {
        setCanRevealHint1(true);
        clearInterval(hint1Timer); // Stop the timer once it reaches 0
        setHint1Revealed(true); // Mark Hint 1 as revealed
      }, hint1Delay);
    
      let hint2Timer;
    
      if (hint1Revealed) {
        hint2Timer = setInterval(() => {
          setCanRevealHint2(true);
          clearInterval(hint2Timer); // Stop the timer once it reaches 0
        }, hint2Delay);
      }
    
      // Update countdown timers every second
      const countdownTimer = setInterval(() => {
        if (!canRevealHint1 && !hint1Revealed) {
          setHint1Countdown((prevCountdown) => prevCountdown - 1);
        }
        if (!canRevealHint2 && hint1Revealed) {
          setHint2Countdown((prevCountdown) => prevCountdown - 1);
        }
      }, 1000);
    
      return () => {
        clearInterval(hint1Timer);
        clearInterval(hint2Timer);
        clearInterval(countdownTimer);
      };
    }, [canRevealHint1, canRevealHint2, hint1Revealed]);    
    

    const revealHint1 = () => {
        setShowHint1(true);
      };
    
      const revealHint2 = () => {
        setShowHint2(true);
      };

    /* Navigation for buttons */
    const navigate = useNavigate();

    const handleSubmitButtonClick = () => { 
      // check user's answer
      console.log(answer)
      console.log(songName)
      if (answer === songName) {
        console.log("CORRECT ANSWER!")
      } else {
        console.log("INCORRECT ANSWER!")
      }
  };

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/dailychallengelobby");
    };

    const [isDialogOpen, setDialogOpen] = useState(false);
    
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

            {/* STAGE 1 - NO HINTS (ONLY AUDIO) - both game modes */}
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
                color: canRevealHint1 ? theme.palette.primary.main : 'dark gray',
                backgroundColor: canRevealHint1 ? theme.palette.secondary.main : 'gray',
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: "-3%",
                marginBottom: "3%",
              }}
              onClick={revealHint1}
              disabled={!canRevealHint1}>
              {canRevealHint1 ? "Reveal Hint 1 🧨" : `Reveal Hint 1 (${hint1Countdown}s)`}
            </Button>
          )}

          {/* Button to reveal hint 2 */}
          {gameMode === "Easy" && showHint1 && !showHint2 && (
            <Button variant="contained"
              style={{
                width: 230,
                color: canRevealHint2 ? theme.palette.primary.main : 'dark gray',
                backgroundColor: canRevealHint2 ? theme.palette.secondary.main : 'gray',
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: "-3%",
                marginBottom: "3%",
              }}
              onClick={revealHint2}
              disabled={!canRevealHint2}>
                {canRevealHint2 ? "Reveal Hint 2 🧨" : `Reveal Hint 2 (${hint2Countdown}s)`}
            </Button>
          )}  

          <br></br>

          

          {/*<TextField
            label="Your Answer"
            style={{ width: "50%" }}
            InputProps={{ style: { color: theme.palette.primary.main } }} 
            InputLabelProps={{ style: { color: theme.palette.primary.main } }} 
            onChange={(event) => setAnswer(event.target.value)}
          />*/}
        
            </CardContent>
        </Card>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          style={{ minHeight: '25vh' }} // Adjust the height as needed
        >
          {/* Text field for answer */}  
        <Autocomplete
            freeSolo
            label="Your Answer"
            style={{ width: "50%", color: 'white'}}
            InputProps={{
              style: { color: theme.palette.primary.main  },
            }}
            InputLabelProps={{
              style: { color: theme.palette.primary.main  },
            }}
            onChange={(event, newValue) => setAnswer(newValue)}
            options={allSongs}
            renderInput={(params) => <TextField {...params} label="Your Answer" />}
          />

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
        onClick={handleSubmitButtonClick}
        >
        Submit
        </Button>

        </Stack>

        
        </div>
    );
}

export default SongSnippetGame;
