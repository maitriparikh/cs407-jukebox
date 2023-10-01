import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CancelIcon from '@mui/icons-material/Cancel';


function SongRouletteGame() {
    const [people, setPeople] = useState([
        {
            name: "Shreya",
            flag: false
        },
        {
            name: "Sean",
            flag: false 
        },
        {
            name: "Maitri",
            flag: false
        },
        {
            name: "Francisco",
            flag: false
        },
    ])
    
    const song_bank = [ 
        {
            song: "https://open.spotify.com/embed/track/6rdkCkjk6D12xRpdMXy0I2?utm_source=generator",
            correctAnswer: [
                { answerText: "Shreya" },
            ]
        },
        {
            song: "https://open.spotify.com/embed/track/5QO79kh1waicV47BqGRL3g?utm_source=generator",
            correctAnswer: [
                { answerText: "Francisco" },
            ]
        },
        {
            song: "https://open.spotify.com/embed/track/5zsHmE2gO3RefVsPyw2e3T?utm_source=generator",
            correctAnswer: [
                { answerText: "Shreya" },
                { answerText: "Maitri" },
            ]
        },
        {
            song: "https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator",
            correctAnswer: [
                { answerText: "Maitri" },
            ]
        },
        {
            song: "https://open.spotify.com/embed/track/0pqnGHJpmpxLKifKRmU6WP?utm_source=generator",
            correctAnswer: [
                { answerText: "Sean" },
            ]
        }
    ]
    
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0); // keeps track of question number
    const [showEnd, setShowEnd] = useState(false); // Determines when quiz ends
    const [selected, setSelected] = useState([]); // Answers the user has selected

    const handleOptionClick = (answerOption) => {
        console.log(answerOption);
      
        const indexToRemove = selected.indexOf(answerOption); // Index to remove in selected when deselected
        const indexClicked = people.findIndex((person) => person.name === answerOption); // change flag state when selected
      
        if (selected.includes(answerOption)) {
          console.log(answerOption + ' already selected, removing now');
      
          // Update the flag in the copied people array to change color
          const updatedPeople = [...people];
          updatedPeople[indexClicked].flag = false;
          setPeople(updatedPeople);
      
          if (indexToRemove !== -1) { // Remove answer option from selected
            selected.splice(indexToRemove, 1);
          }
        } else {

          selected.push(answerOption);
          const updatedPeople = [...people];
          updatedPeople[indexClicked].flag = true;
          setPeople(updatedPeople);

        }
      
        console.log(selected);
        console.log(people);
      
        return;
      };
    
    const handleNextButtonClick = (answerOption) => {
        // Increment question when Next Button is pressed

        if (currentQuestion == song_bank.length - 1) { // End of song_bank reached
            setShowEnd(true);
        } 
        else if (currentQuestion < song_bank.length - 1) { // Change question to next question
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
        }
    };
    
    return (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

          <Card style={{ borderRadius: '12px', position: 'relative' }}>
            {/* Cancel Icon */}
            <CancelIcon
                style={{
                color: "var(--text-color)",
                position: 'absolute',
                top: '15px',
                right: '15px',
                height: '40px',
                width: '40px',
                cursor: 'pointer',
                zIndex: 1, 
                }}
            />
            
            <CardContent>
            <br></br>
            <iframe 
                style={{ borderRadius: '12px' }}
                src={song_bank[currentQuestion].song}
                width="70%" 
                height="200" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
                <Grid xs={8} sm={6}>
                {people.map(person => (
                    <Button
                        key={person.name}
                        sx={{
                        width: 300,
                        border: `2px solid var(--text-color)`,
                        padding: 1,
                        margin: { xs: 4, sm: 4 },
                        backgroundColor: person.flag ? 'var(--accent-color)' : 'white',
                        "&:hover": {
                            backgroundColor: 'var(--accent-color)',
                        },
                        //borderWidth: "2px",
                        }}
                        onClick={() => handleOptionClick(person.name)}
                    >
                    {person.name}
                    </Button>
                ))}
                </Grid>
            </CardContent>
        </Card>
        </div>
      );
}

export default SongRouletteGame;
