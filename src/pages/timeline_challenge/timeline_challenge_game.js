import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
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

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useTheme } from '@mui/material/styles';

import Timer from '../timeline_challenge/timer';

function TimelineChallengeGame() {

  const theme = useTheme();
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const songInfoArrayGet = location.state.songInfoArray
  const [songInfoArray, setSongInfoArray] = useState(songInfoArrayGet);

  const [sortedSongDeck, setSortedSongDeck] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState([]);
  const [startTime, setStartTime] = useState(Date.now()); 
  const [showEnd, setShowEnd] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const [finalScore, setFinalScore] = useState(0);

  const exitgame_click = () => {
    console.log("EXIT GAME CLICKED");
    navigate("/timelinechallengelobby");
  };

  const handleGoHomepage = () => {
    navigate("/homepage")
  }

  const handleReplay = () => {
    navigate("/timelinechallengelobby")
  }

  /*useEffect(() => {
    let interval = null;
    
    if (!showEnd && timeElapsed < 300) {
      interval = setInterval(() => {
        const tempTime = Math.floor((Date.now() - startTime) / 1000)
        setTimeElapsed(tempTime);

        if (tempTime >= 300) { // if tries exceeds 30 or 10 minutes have elapsed, game ends
          console.log("GAME OVER")
          handleSubmit(songInfoArray)
        }

      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [showEnd, startTime]);*/

  const handleTimeUp = () => {
    // Logic to execute when the timer is up
    console.log("Time is up!");
    handleSubmit(songInfoArray);
  };


  // Sorting function
  const sortSongs = (songs) => {
    return songs.sort((a, b) => {
      // First compare by date
      const dateComparison = a.songDate.localeCompare(b.songDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If dates are the same, then sort by name
      return a.songName.localeCompare(b.songName);
    });
  };

  useEffect(() => {
    // Sort shuffledSongDeck and update sortedSongDeck
    const sortedSongs = sortSongs([...songInfoArray]);
    setSortedSongDeck(sortedSongs);
  }, [songInfoArray]);


  const DraggableCard = ({ card, index, moveCard }) => {
    const [, ref] = useDrag({
      type: 'CARD',
      item: { id: card.id, index },
    });
  
    const [, drop] = useDrop({
      accept: 'CARD',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveCard(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });
  
    return (
      <div ref={(node) => ref(drop(node))}>
        
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
            maxWidth: '1000px', 
            margin: '0 auto',
          }}
        >
          {/* Album Cover */}
          <img
            src={card.songAlbumPic}
            alt="Album Cover"
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '12px',
              marginRight: '16px',
            }}
          />

      <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: '1%',
            flex: 1,
          }}
        >
          {/* Song Name */}
          <Typography variant="h4" style={{ color: 'white', marginBottom: "2%", fontWeight: "bold"}}>{card.songName}</Typography>

          {/* Artist */}
          <Typography variant="p" style={{ color: 'white', marginBottom: "2%" }}>{card.songArtist}</Typography>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginLeft: '1%',
            flex: 1, 
          }}
        >
          {/* Use the AudioPlayer component */}
        <AudioPlayer src={card.songAudio} />
        </div>
        </div>
        
      </div>
    );
  };

  const AudioPlayer = ({ src }) => {
    return (
      <audio controls style={{ width: '400px', borderRadius: '12px', marginTop: "1%", marginRight: "1%" }}>
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  const moveCard = useCallback((fromIndex, toIndex) => {
    const updatedCards = [...songInfoArray];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setSongInfoArray(updatedCards);
  }, [songInfoArray]);
  
  
 

  const handleSubmit = (answerArray) => {
    let score = 0;

    const totalPositions = sortedSongDeck.length;
    const maxDistance = totalPositions - 1; // Maximum distance an element can be from its correct position
    const scorePerDistance = 1000 / (totalPositions * maxDistance);

    answerArray.forEach((answerItem, index) => {
      const correctIndex = sortedSongDeck.findIndex(sortedItem => sortedItem.songName === answerItem.songName);
      const distance = Math.abs(correctIndex - index); // Distance from correct position

      // Award points based on closeness to correct position
      score += (maxDistance - distance) * scorePerDistance;
    });

    // Ensure score does not exceed maximum or go below zero
    score = Math.max(0, Math.min(score, 1000));
    // Handle the score as needed
    console.log(`Score: ${score}`);

    setFinalScore(Math.floor(score))
    setShowEnd(true)
    if (score === 1000) {
      setAllCorrect(true)
    }
    
  }; 

  return (
    <div>
      {showEnd ? (
          <div style={{ marginTop: "6%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

           {allCorrect ? (
              <Typography variant="h2" style={{ textAlign: "center"}}>
                Congratulations! You completed the Timeline Challenge.
              </Typography>
           ) : (
            <Typography variant="h2" style={{ textAlign: "center"}}>
              Oops! Your ordering is not quite there.
            </Typography>
           )}           
          

          <br></br>
          
          <Typography variant="h3" style={{ textAlign: "center"}}>
              You earned {finalScore} points in this game!
          </Typography>


          <br></br>
          <br></br>


          <Grid container spacing={2} direction="row" justifyContent="center">
  
          {/* First Grid */}

          <Card
          style={{ 
            height: "100%", 
            border: `3px solid ${theme.palette.primary.main}`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "40%", 
            margin: "0 auto", 
            padding: "1%",
            backgroundColor: theme.palette.background.default}}>

            <Typography variant="h4" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "2%"}}>
              Your Answer:
            </Typography>

                  {songInfoArray.map((song) => (
                    <Grid container spacing={1}>
                    <Grid item xs={8.5} >

                      <Typography variant="h4" key={song.id} style={{ textAlign: "center", marginBottom: "1%" }}>
                          {song.songName}
                        </Typography>
                      
                    </Grid>
    
                    <Grid item xs={3}>
                      
    
                        <Typography variant="h4" key={song.id} style={{ textAlign: "center", marginBottom: "1%" }}>
                          {song.songDate}
                        </Typography>
    
                    </Grid>
                    </Grid>
                  ))}

          </Card>

          {/* Second Grid */}
          <Card
          style={{ 
            height: "100%", 
            border: `3px solid ${theme.palette.primary.main}`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "40%", 
            margin: "0 auto", 
            padding: "1%",
            backgroundColor: theme.palette.background.default}}>

            <Typography variant="h4" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "2%"}}>
              Correct Answer:
            </Typography>

                  {sortedSongDeck.map((song) => (
                    <Grid container spacing={1}>
                    <Grid item xs={8.5} >

                      <Typography variant="h4" key={song.id} style={{ textAlign: "center", marginBottom: "1%" }}>
                          {song.songName}
                        </Typography>
                      
                    </Grid>
    
                    <Grid item xs={3}>
                      
    
                        <Typography variant="h4" key={song.id} style={{ textAlign: "center", marginBottom: "1%" }}>
                          {song.songDate}
                        </Typography>
    
                    </Grid>
                    </Grid>
                  ))}

              

          </Card>


        </Grid>



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
      
        <Typography variant="h3" style={{ textAlign: "center" }}>
          Arrange the songs!
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

              <Timer maxTime={120} onTimeUp={handleTimeUp}/>

            <br />

            <DndProvider backend={HTML5Backend}>
            <div>
            {songInfoArray.map((card, index) => (
              <DraggableCard key={card.id} card={card} index={index} moveCard={moveCard} />
            ))}
            </div>
          </DndProvider>

          <br></br>


            {/* 
            <div>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div>
                <Typography variant="h3" style={{ textAlign: "center" }}>
                  Original
                </Typography>
                {songInfoArray.map((song) => (
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    Name: {song.songName}, Date: {song.songDate}
                  </Typography>
                ))}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div>
                <Typography variant="h3" style={{ textAlign: "center" }}>
                  Sorted
                </Typography>
                {sortedSongDeck.map((song) => (
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    Name: {song.songName}, Date: {song.songDate}
                  </Typography>
                ))}
              </div>
            </Grid>
          </Grid>
          </div>
          */}

        </Card>

        <br></br>

        <Button variant="contained"
              style={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold",
              marginBottom: "2%"
              }}  
              onClick={() => handleSubmit(songInfoArray)} >
              Submit
            </Button>
      
      </div>   

    )}
        
    </div>
    );
}

export default TimelineChallengeGame;