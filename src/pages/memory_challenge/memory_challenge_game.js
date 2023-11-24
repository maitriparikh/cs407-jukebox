import React, { useState, useEffect, useContext } from "react";
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
    useEffect(() => {
      // only shuffle deck ONCE when rendering
      setShuffledSongDeck(shuffleArray(songInfoArray.concat(songInfoArray)));
    }, []); 

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

    const [isFlipped, setIsFlipped] = useState(false);

    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);

    let totalMatchedSongs = 0;

    const handleCardClick = (index) => {
      setIsFlipped(true);
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, index]);

      if (flippedCards.length === 1) {
        const firstCardIndex = flippedCards[0];
        const firstCard = shuffledSongDeck[firstCardIndex];
        const secondCard = shuffledSongDeck[index];
    
        if (
          firstCard.songName === secondCard.songName &&
          firstCard.songArtist === secondCard.songArtist &&
          firstCard.songAlbumPic === secondCard.songAlbumPic
        ) {
          console.log("songs match!");
          setMatchedPairs((prevMatchedPairs) => [...prevMatchedPairs, firstCard]);
          // increment counter keeping track of matched pairs to figure out when game is over
          totalMatchedSongs++;
          console.log("totalMatchedSongs: ", totalMatchedSongs);
          // reset flipped cards since match is found
          setFlippedCards([]);
        } else {
          console.log("songs do not match!");
          setTimeout(() => setFlippedCards([]), 1000); // Add a delay before flipping back
        }
      }
    };
  
    const isCardFlipped = (index) => {
      // if card is currently flipped or was already matched (then details should show)
      return flippedCards.includes(index) || matchedPairs.includes(shuffledSongDeck[index]);
    };

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/memorychallengelobby");
    };


    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>
        <Typography variant="h3" style={{ textAlign: "center" }}>
          Find the matching songs!
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

                  {/* Audio Preview */}
                  <audio controls style={{ width: '100%', borderRadius: '12px', marginTop: "4%" }}>
                    <source src={song.songAudio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </CardContent>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      </CardContent>
      </Card>

      </div>
    );

  }
    

export default MemoryChallengeGame;