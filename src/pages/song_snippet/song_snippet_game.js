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
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { UserContext } from "../../App";
import Autocomplete from '@mui/material/Autocomplete';

import CorrectAnswerSound from "../../sounds/correct_answer.mp3";
import WrongAnswerSound from "../../sounds/wrong_answer.mp3";
import FanfareSound from "../../sounds/fanfare.mp3";
import { v4 as uuid } from "uuid";


function SongSnippetGame() {

    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const [myPlaylist, setMyPlaylist] = useState([]); // intermediate playlist array
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token

    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);

    const [showEnd, setShowEnd] = useState(false);
    const gameMode = location.state.gameMode;
    const allSongs = location.state.allSongs
    const songInfoArrayGet = location.state.songInfoArray
    const [songInfoArray, setSongInfoArray] = useState(songInfoArrayGet);
    //console.log("GAME MODE = " + gameMode)
    //console.log("SONG INFO = ", songInfo)
    //console.log("ALL SONGS = ", allSongs)
    //console.log("SONG INFO ARRAY = ", songInfoArray)

    // 0 = previewURL, 1 = artistName, 2 = album cover, 3 = song name
    // temp hardcoded song for iframe display
    const songName = songInfoArray[0].songName;
    const songArtist = songInfoArray[0].songArtist;
    const songAlbumPic = songInfoArray[0].songAlbumPic;
    const songAudio = songInfoArray[0].songAudio;
    console.log("SONG NAME", songName)

    const [currentRound, setCurrentRound] = useState(0);

    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);

    const hint1Delay = 10000; // 10 seconds
    const hint2Delay = 10000; // 10 seconds

    const [canRevealHint1, setCanRevealHint1] = useState(false);
    const [canRevealHint2, setCanRevealHint2] = useState(false);

    const [hint1Revealed, setHint1Revealed] = useState(false);

    const [hint1Countdown, setHint1Countdown] = useState(hint1Delay / 1000);
    const [hint2Countdown, setHint2Countdown] = useState(hint2Delay / 1000);
    
    const [noMoreTries, setNoMoreTries] = useState(false);

    const [overallPoints, setOverallPoints] = useState(0);

    useEffect(() => {
      let hint1Timer;
      let hint2Timer;
    
      if (!hint1Revealed && !showHint1) {
        hint1Timer = setTimeout(() => {
          setCanRevealHint1(true);
        }, hint1Delay);
      }
    
      if (hint1Revealed && !showHint2 && canRevealHint1) {
        hint2Timer = setTimeout(() => {
          setCanRevealHint2(true);
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
        clearTimeout(hint1Timer);
        clearTimeout(hint2Timer);
        clearInterval(countdownTimer);
      };
    }, [canRevealHint1, canRevealHint2, hint1Revealed, showHint1, showHint2]);    
  

    const revealHint1 = () => {
      setShowHint1(true);
      setHint1Revealed(true); // to start timer for hint 2

      const currentPoints = songInfoArray[currentRound].points - 10;
      console.log("currentPoints", currentPoints)
      const updatedSongInfoArray = [...songInfoArray];
      updatedSongInfoArray[currentRound].points = currentPoints;
      setSongInfoArray(updatedSongInfoArray);
    };
    
    const revealHint2 = () => {
      setShowHint2(true);
      
      const currentPoints = songInfoArray[currentRound].points - 10;
      console.log("currentPoints", currentPoints)
      const updatedSongInfoArray = [...songInfoArray];
      updatedSongInfoArray[currentRound].points = currentPoints;
      setSongInfoArray(updatedSongInfoArray);
    };

    /* Navigation for buttons */
    const navigate = useNavigate();

    

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/songsnippetlobby");
    };

    const [alertOpen, setAlertOpen] = useState(false); 
    const [isDialogOpen, setDialogOpen] = useState(false);
    
    const closeDialog = () => {
      setDialogOpen(false);
    };

    const handleDialogStayOnGamePage = () => {
      setAlertOpen(false)
    }

    const handleGoHomepage = () => {
      navigate("/homepage")
    }

    const handleReplay = () => {
      navigate("/songsnippetlobby")
    }

    const handleNextRound = async () => {
        if (currentRound < songInfoArray.length - 1) {
            setAlertOpen(false);

            setShowHint1(false);
            setShowHint2(false);

            setCanRevealHint1(false);
            setCanRevealHint2(false);

            setHint1Revealed(false);

            setHint1Countdown(hint1Delay / 1000)
            setHint2Countdown(hint2Delay / 1000)
            setNoMoreTries(false);

            setIsCorrect(false);

            // cap round score so it doesn't go below 0
            if (songInfoArray[currentRound].points < 0) {
              songInfoArray[currentRound].points = 0
            }
            const pointsAdd = overallPoints + songInfoArray[currentRound].points;
            setOverallPoints(pointsAdd)

            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            console.log("finish round");
        } else {
            // cap round score so it doesn't go below 0
            if (songInfoArray[currentRound].points < 0) {
              songInfoArray[currentRound].points = 0
            }
            const pointsAdd = overallPoints + songInfoArray[currentRound].points;
            setOverallPoints(pointsAdd)
            
            setShowEnd(true);
            const audio = new Audio(FanfareSound);
            audio.play();

            await sendGameScore(pointsAdd);
        }
    }

    const sendGameScore = async (score) => {
      var hs = 0;
      const docRef = doc(db, "users", user);
      const docSnap = await getDoc(docRef);
      hs = docSnap.data().snippetHighScore;

      if (typeof hs === 'undefined') {
        console.log("memory high score is undefined");
        hs = 0;
      }
      const gameId = uuid();

      console.log("hs is " + hs + " and overall pts is " + overallPoints);
      if (score > hs) {  
        await updateDoc(docRef, {
          snippetHighScore: overallPoints,
          snippetGameScore: arrayUnion({
              gameId: gameId,
              rounds: songInfoArray.length,
              score: score,
              gameMode: gameMode
          })
        }).then(() => console.log("Document updated with new high score"));
      } else {
          await updateDoc(docRef, {
            snippetGameScore: arrayUnion({
                  gameId: gameId,
                  rounds: songInfoArray.length,
                  score: score,
                  gameMode: gameMode
              })
          }).then(() => console.log("Document updated with no new high score"));
      }

    }

    const handleSubmitButtonClick = () => { 
        // check user's answer
        console.log(answer)
        console.log(songInfoArray[currentRound].songName)
        if (answer === songInfoArray[currentRound].songName) {
          setIsCorrect(true);
          setAlertOpen(true);
          console.log("CORRECT ANSWER!")
          const audio = new Audio(CorrectAnswerSound);
          audio.play();
        } else {
          // decrement num of tries by 1, and decrement current points by 25
          console.log("INCORRECT ANSWER!")
          console.log("songInfoArray[currentRound].points", songInfoArray[currentRound].points)
          console.log("songInfoArray[currentRound].tries", songInfoArray[currentRound].tries)
          
          // if you get the answer wrong (1 try left), move to next round with 0 points
          if (songInfoArray[currentRound].tries == 1) {
            const currentPoints = songInfoArray[currentRound].points - 25;
            console.log("currentPoints", currentPoints)
            const updatedSongInfoArray = [...songInfoArray];
            updatedSongInfoArray[currentRound].points = currentPoints;
            setSongInfoArray(updatedSongInfoArray);

            setIsCorrect(true);
            setNoMoreTries(true);
          }

          const currentPoints = songInfoArray[currentRound].points - 25;
          const currentTries = songInfoArray[currentRound].tries - 1;
          
          console.log("currentPoints", currentPoints)
          console.log("currentTries", currentTries)
          
          const updatedSongInfoArray = [...songInfoArray];
          updatedSongInfoArray[currentRound].points = currentPoints;
          updatedSongInfoArray[currentRound].tries = currentTries;
          setSongInfoArray(updatedSongInfoArray);

          console.log("UPDATED???", songInfoArray)
          
          setAlertOpen(true);
          
          const audio = new Audio(WrongAnswerSound);
          audio.play();
        }
    };


    /*  
      *   SYSTEM FOR AWARDING POINTS
      *     HARD MODE (for each round)
      *     start off with +100 in beginning of round
      *     -25 if wrong on 1st try (overall 75)
      *     -25 pts if wrong on 2rd try (overall 50)
      *     -50 if wrong on 3rd try (overall 0, moves to next round)

      *     EASY MODE (for each round)
      *     start off with +100 in beginning of round
      *     -10 if ANY hint is revealed at any point in the round
      *     -25 if wrong on 1st try (overall 75)
      *     -25 pts if wrong on 2rd try (overall 50)
      *     -50 if wrong on 3rd try (overall 0, moves to next round)
    */

    return (

        <div>
        {showEnd ? (
        <div style={{ marginTop: "10%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>
            
            <Typography variant="h2" style={{ textAlign: "center"}}>
                Congratulations! You completed the Song Snippet Challenge.
            </Typography>

            <br></br>
            
            <Grid xs={8} sm={6}>
            {songInfoArray.map(round => (
                <div>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    Song: {round.songName}, Points: {round.points}
                </Typography> 
                <br></br>
                </div>
            ))}
            </Grid>
            
            <Typography variant="h3" style={{ textAlign: "center"}}>
                You earned {overallPoints} points in this game!
            </Typography>


            <br></br>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              style={{ minHeight: '10vh' }} // Adjust the height as needed
            >

            <Button variant="contained"
            style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }}  
            onClick={handleReplay} >
            Replay
            </Button>

            <Button variant="contained"
            style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }}  
            onClick={handleGoHomepage} >
            Back to Home
            </Button>

            </Stack>
          </div>
        ) : (
            <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h3" style={{ textAlign: "center"}}>
           Round {currentRound + 1} of {songInfoArray.length}
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
            
            <CardContent>
            <br></br>
            <br></br>
            <br></br>

            {!isCorrect && (
              <div>
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
                    <source src={songInfoArray[currentRound].songAudio} type="audio/mpeg" />
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
                  <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songInfoArray[currentRound].songArtist}</Typography>

                  {/* Audio Preview */}
                  <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                    <source src={songInfoArray[currentRound].songAudio} type="audio/mpeg" />
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
                  src={songInfoArray[currentRound].songAlbumPic}
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
                <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songInfoArray[currentRound].songArtist}</Typography>

                {/* Audio Preview */}
                <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                  <source src={songInfoArray[currentRound].songAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              </div>
                )}
              </div>
            )}


            {/* STAGE 4 - CORRECT ANSWER */}
            {isCorrect && (
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
                src={songInfoArray[currentRound].songAlbumPic}
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
              <Typography variant="h3" style={{ color: 'white', marginBottom: "2%" }}>{songInfoArray[currentRound].songName}</Typography>

              {/* Artist */}
              <Typography variant="h4" style={{ color: 'white', marginBottom: "2%" }}>{songInfoArray[currentRound].songArtist}</Typography>

              {/* Audio Preview */}
              <audio controls style={{ width: '880px', borderRadius: '12px', marginTop: "1%" }}>
                <source src={songInfoArray[currentRound].songAudio} type="audio/mpeg" />
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
                color: canRevealHint1 ? theme.palette.primary.main : 'gray',
                backgroundColor: canRevealHint1 ? theme.palette.secondary.main : 'light gray',
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
                color: canRevealHint2 ? theme.palette.primary.main : 'gray',
                backgroundColor: canRevealHint2 ? theme.palette.secondary.main : 'light gray',
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

        <br></br>

        {/* CORRECT ANSWER DIALOG */}
        {isCorrect && (
          <Dialog open={alertOpen} onClose={handleNextRound} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
          <DialogTitle>
          <Typography variant="h3" style={{ textAlign: "left" }}>
            Congratulations!
          </Typography>
            </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Typography variant="h4" style={{ textAlign: "left" }}>
              You have correctly identified the mystery song! Your current point total for this round is {songInfoArray[currentRound].points}.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
              style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold"
                }} 
              onClick={handleNextRound}>
              Next
            </Button>
          </DialogActions>
          </Dialog>
        )}

        {/* INCORRECT ANSWER DIALOG */}
        {!isCorrect && !noMoreTries && (
          <Dialog open={alertOpen} onClose={handleDialogStayOnGamePage} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
          <DialogTitle>
          <Typography variant="h3" style={{ textAlign: "left" }}>
            Try Again!
          </Typography>
            </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Typography variant="h4" style={{ textAlign: "center" }}>
            <pre>-25</pre>
          </Typography>
            <Typography variant="h4" style={{ textAlign: "left" }}>
              You have not yet identified the mystery song - take another guess. You have {songInfoArray[currentRound].tries} tries left to guess the song and your current point total for this round is {songInfoArray[currentRound].points}.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
              style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold"
                }} 
              onClick={handleDialogStayOnGamePage}>
              OK
            </Button>
          </DialogActions>
          </Dialog>
        )}

        {/* NO TRIES LEFT, MOVE TO NEXT Q DIALOG */}
        {noMoreTries && (
          <Dialog open={alertOpen} onClose={handleNextRound} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
          <DialogTitle>
          <Typography variant="h3" style={{ textAlign: "left" }}>
            Uh oh!
          </Typography>
            </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Typography variant="h4" style={{ textAlign: "left" }}>
              You weren't able to identify the mystery song in 3 tries. Your point total for this round is 0.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
              style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold"
                }} 
              onClick={handleNextRound}>
              OK
            </Button>
          </DialogActions>
          </Dialog>
        )}

        </Stack>

        
        </div>
        )}
        

        
        </div>
    );
}

export default SongSnippetGame;
