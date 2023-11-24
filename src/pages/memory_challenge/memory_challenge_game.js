import React, { useState, useEffect, useContext, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import { useLocation, useNavigate } from "react-router-dom";
import ButtonBase from '@mui/material/ButtonBase';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { UserContext } from "../../App";
import CancelIcon from '@mui/icons-material/Cancel';

import CorrectAnswerSound from "../../sounds/correct_answer.mp3";
import WrongAnswerSound from "../../sounds/wrong_answer.mp3";
import FanfareSound from "../../sounds/fanfare.mp3";

import { useTheme } from '@mui/material/styles';

function MemoryChallengeGame() {

    const theme = useTheme();

    /* Navigation for buttons */
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const allSongs = location.state.allSongs
    const songInfoArrayGet = location.state.songInfoArray
    const [songInfoArray, setSongInfoArray] = useState(songInfoArrayGet);
  
    const songName = songInfoArray[0].songName;
    const songArtist = songInfoArray[0].songArtist;
    const songAlbumPic = songInfoArray[0].songAlbumPic;
    const songAudio = songInfoArray[0].songAudio;

    const fullSongDeck = songInfoArray.concat(songInfoArray);

    const [shuffledSongDeck, setShuffledSongDeck] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [startTime, setStartTime] = useState(Date.now()); 
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);

    const [tries, setTries] = useState(0);
    const [matchedSongs, setMatchedSongs] = useState(0);

    const [showEnd, setShowEnd] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const [lostTheGame, setLostTheGame] = useState(false);

    const audioRef = useRef();

    useEffect(() => {
      // only shuffle deck ONCE when rendering
      setShuffledSongDeck(shuffleArray(songInfoArray.concat(songInfoArray)));
    }, []); 

    useEffect(() => {
      let interval = null;
      
      if (!showEnd && timeElapsed < 300) {
        interval = setInterval(() => {
          const tempTime = Math.floor((Date.now() - startTime) / 1000)
          setTimeElapsed(tempTime);

          if (tempTime >= 300) { // if tries exceeds 30 or 10 minutes have elapsed, game ends
            console.log("YOU LOST")
            setLostTheGame(true)
            setShowEnd(true)
          }
        }, 1000);
      } else if (interval) {
        clearInterval(interval);
      }
    
      return () => clearInterval(interval);
    }, [showEnd, startTime]);
    

    const shuffleArray = (array) => {
      // Create a copy of the original array
      const shuffledArray = [...array];
      let currentIndex = shuffledArray.length, randomIndex, temporaryValue;
  
      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        // And swap it with the current element.
        temporaryValue = shuffledArray[currentIndex];
        shuffledArray[currentIndex] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = temporaryValue;
      }
  
      return shuffledArray;
    };



    const handleCardClick = (index) => {
      console.log("TOTAL TRIES", tries);

      // pause the current audio before setting the new flipped cards
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (flippedCards.length < 2) {
        
        setFlippedCards((prevFlippedCards) => [...prevFlippedCards, index]);

        const firstCardIndex = flippedCards[0];
        // first card that was flipped over
        const firstCard = shuffledSongDeck[firstCardIndex];
        // current card
        const secondCard = shuffledSongDeck[index];

        if (firstCardIndex == index) {
          setFlippedCards((prevFlippedCards) => prevFlippedCards.slice(0, -1));
        } else {
          if (flippedCards.length === 1) {
            
            if (
              firstCard.songName == secondCard.songName &&
              firstCard.songArtist == secondCard.songArtist &&
              firstCard.songAlbumPic == secondCard.songAlbumPic
            ) {
              console.log("songs match!");
              const audio = new Audio(CorrectAnswerSound);
              audio.play();
              setMatchedPairs((prevMatchedPairs) => [...prevMatchedPairs, firstCard]);
              // increment counter keeping track of matched pairs to figure out when game is over
              let tempMatchedSongs = matchedSongs + 1;
              setMatchedSongs(tempMatchedSongs);
              console.log("TOTAL MATCHED SONGS: ", matchedSongs);
              
              if (matchedSongs == songInfoArray.length - 1) {
                console.log("DONE WITH GAME!");
                // timeElapsed and tries used to determine the amount of points 
                // more time (greater timeElapsed) and more tries used equals lower score 
                // (1 - 30/300) * 300 + (1 - 10/30) * 200 + (10/10)*500
                console.log("SECONDS ELAPSED: ", timeElapsed);
                console.log("INCORRECT GUESSES TAKEN: ", tries);

                let timeScore = (1 - (timeElapsed/300)) * 300; // section of the points coming from time taken
                let triesScore = (1 - (tries/300)) * 100; // section of score coming from tries
                let lengthScore = (songInfoArray.length/10) * 600 // section of score coming from amount of songs
                let tempFinalScore = timeScore + triesScore + lengthScore; // added together (out of 1000 points)

                console.log("FINAL SCORE beforing Math.floor: ", tempFinalScore);
                setFinalScore(Math.floor(tempFinalScore));
                console.log("FINAL SCORE: ", finalScore);
                setShowEnd(true);
                const audio = new Audio(FanfareSound);
                audio.play();
              }
              // reset flipped cards since match is found
              setFlippedCards([]);
            } else {
                console.log("songs do not match!");
                const audio = new Audio(WrongAnswerSound);
                // to figure out total score
                let tempTries = tries + 1;
                setTries(tempTries);

                setTimeout(() => {
                  setFlippedCards([])
                  audio.play()
                }, 2000)

                if (tries >= 29) {
                  console.log("TRIES EXCEEDED")
                  setLostTheGame(true)
                  setShowEnd(true)
                }
              
            }
          }
        }

      }
      console.log("flippedCards after click: ", flippedCards);
    };
  
    const isCardFlipped = (index) => {
      // if card is currently flipped or was already matched (then details should show)
      return flippedCards.includes(index) || matchedPairs.includes(shuffledSongDeck[index]);
    };

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/memorychallengelobby");
    };

    const handleGoHomepage = () => {
      navigate("/homepage")
    }

    const handleReplay = () => {
      navigate("/memorychallengelobby")
    }
    
    const formatTime = (totalSeconds) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };   
    
    const formatTime2 = (totalSeconds) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      if (minutes === 1) {
        return `${minutes.toString()} minute and ${seconds.toString()} seconds`;
      }
      return `${minutes.toString()} minutes and ${seconds.toString()} seconds`;
    }; 

    return (
      <div>
        {showEnd ? (

          lostTheGame ? ( 

            <div style={{ marginTop: "10%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>
            
            <Typography variant="h2" style={{ textAlign: "center"}}>
                Sorry! You lost the Memory Challenge.
            </Typography>

            <br></br>
            
            <Typography variant="h3" style={{ textAlign: "center"}}>
                You earned {finalScore} points in this game.
            </Typography>
            
            <Typography variant="h3" style={{ textAlign: "center"}}>
                You used up {formatTime2(timeElapsed)}.
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
            <div style={{ marginTop: "10%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>
            
            <Typography variant="h2" style={{ textAlign: "center"}}>
                Congratulations! You completed the Memory Challenge.
            </Typography>

            <br></br>
            
            <Typography variant="h3" style={{ textAlign: "center"}}>
                You earned {finalScore} points in this game!
            </Typography>
            
            <Typography variant="h3" style={{ textAlign: "center"}}>
                You matched all of the songs in {formatTime2(timeElapsed)}.
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
          )
      ) : (
        
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>
            <div>

            </div>
          <Typography variant="h3" style={{ textAlign: "center" }}>
            Match the songs!
          </Typography>
          <br></br>

          <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
            <br></br>
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

              <Typography variant="h2" style={{ textAlign: "center" }}>
              {formatTime(timeElapsed)}
              </Typography>

              <Typography variant="h4" style={{ textAlign: "center" }}>
              Incorrect Guesses: {tries}
              </Typography>
              
              
              <CardContent>
              <br></br>

          <Grid container spacing={2}>
          {shuffledSongDeck.map((song, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card sx={{
                backgroundColor: isCardFlipped(index) ? "#282828" : theme.palette.secondary.main,
                color: theme.palette.primary.main,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: '20px',
                height: "220px",
                width: "100%",
              }}
              onClick={() => handleCardClick(index)}
              >
                {isCardFlipped(index) && (
                  <CardContent>
                    {matchedPairs.includes(shuffledSongDeck[index]) ? (
                      <div>
                    {/* EMPTY SPACE AT TOP */}
                    <div
                        style={{
                          width: '90px',
                          height: '20px',
                          background: '#282828', 
                          borderRadius: '12px',
                          marginRight: '16px',
                        }}
                      ></div>
                    {/* Album Cover */}
                    <img
                      src={song.songAlbumPic}
                      alt="Album Cover"
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '12px',
                        marginBottom: "4%"
                      }}
                    />
                    {/* Song Name */}
                    <Typography variant="h4" style={{ color: 'white', marginBottom: "2%", fontWeight: "bold" }}>
                      {song.songName}
                    </Typography>

                    {/* Artist */}
                    <Typography variant="p" style={{ color: 'white', marginBottom: "2%" }}>
                      {song.songArtist}
                    </Typography>
                    </div>
                    ) : (
                      <div>
                        {/* EMPTY SPACE AT TOP */}
                        <div
                        style={{
                          width: '90px',
                          height: '140px',
                          background: '#282828', 
                          borderRadius: '12px',
                          marginRight: '16px',
                        }}
                      ></div>
                      {/* Audio Preview */}
                      <audio controls ref={audioRef} autoPlay style={{ width: '100%', borderRadius: '12px' }}>
                        <source src={song.songAudio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        </CardContent>
        </Card>

        </div>
        )}
        
      </div>
    );
}
    

export default MemoryChallengeGame;