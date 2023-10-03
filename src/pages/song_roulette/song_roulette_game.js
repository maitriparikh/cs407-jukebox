import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
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



function SongRouletteGame() {

    /* Navigation for buttons */
    const navigate = useNavigate();

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/songroulettelobby");
    };
    
    const location = useLocation();

    const rounds = location.state.rounds; // Get number of rounds from lobby page

    const peopleGet = location.state.people; // Get people array from lobby page
    const [people, setPeople] = useState(peopleGet);

    const song_bankGet = location.state.song_bank; // Get song_bank array from lobby page
    const song_bank = song_bankGet

    console.log("NUMBER OF ROUNDS = " + rounds);
    console.log(people);
    console.log(song_bank);

    const me = "Shreya" // should be name of current player
    const meIndex = people.findIndex((person) => person.name === me); // change flag state when selected
    
    const [currentQuestion, setCurrentQuestion] = useState(0); // keeps track of question number
    const [showGame, setShowGame] = useState(true); // Determines when quiz ends
    const [selected, setSelected] = useState([]); // Answers the user has selected
    const [alertOpen, setAlertOpen] = useState(false); // Open/close dialog
    const [currentPoints, setCurrentPoints] = useState(0); // Points during each round
    let pointText = ""; // Text in dialog at the end
    const [pointTextState, setPointTextState] = useState("");    
    const [winner, setWinner] = useState(""); // To display winner in summary
    


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
    
    const handleSubmitButtonClick = (answerOption) => { // Shows dialog with everyone's points
        // check user's selection
        checkAnswers(selected);
        setAlertOpen(true)
    };

    const handleNextQuestion = () => { // Change question to next question
        // Increment question when Next Button is pressed
        setAlertOpen(false)
        
        // Reset (clearing previous question's selections)
        // reset answer option flags
        for (let i = 0; i < people.length; i++) { 
            people[i].flag = false;
        }
        // reset selected option (for next question)
        setSelected([]);

        if (currentQuestion == rounds - 1) { // Max rounds reached
            setShowGame(!showGame);

            /* CALCULATE WINNER */
            const sortedPeople = [...people];
            sortedPeople.sort((a, b) => b.points - a.points);

            let winners = "";
            let topScore = sortedPeople[0].points;
            for (let i = 1; i < sortedPeople.length; i++) {
                if (sortedPeople[i].points == topScore) { // tie found
                    winners += sortedPeople[i].name + ", "
                }    
            }

            if (winners != "") {
                winners += "and " + sortedPeople[0].name + " have won this game of Song Roulette! 🎉"
                setWinner(winners)
            }
            else {
                let gameWinner = sortedPeople[0].name + " has won this game of Song Roulette! 🎉"
                setWinner(gameWinner)
            }
            
        } 
        else if (currentQuestion < song_bank.length - 1) { // Change question to next question
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
        }
    }

    const checkAnswers = (selected) => {
        /*  
         *   SYSTEM FOR AWARDING POINTS
         *      each correct answer = +100  
         *      each wrong answer = -50
         *      each missing answer = -25
         *      no answer selected = -25
        */

        console.log("CHECKING ANSWER")

        let curPoints = 0 // total points for current round
        
        // Correct answer and wrong answer scoring
        for (var i = 0; i < selected.length; i++) {
            const selectedName = selected[i];
            const correctAnswers = song_bank[currentQuestion].correctAnswer;

            console.log(selectedName + ", " + correctAnswers);

            // each correct answer (+100)
            if (correctAnswers.some(answer => answer === selectedName)) {
                curPoints += 100;

                pointText += "Correct Answer +100\n"
                console.log(pointText)
                console.log("Correct answer found! +100, points = " + curPoints);
            }
            // each wrong answer (-50)
            if (correctAnswers.every(answer => answer !== selectedName)) {
                curPoints -= 50;

                pointText += "Wrong Answer -50\n"
                console.log(pointText)
                console.log("Selected answer is not a correct answer! -50, points = " + curPoints);
            }
        }

        // Missing answer scoring
        const correctAnswers = song_bank[currentQuestion].correctAnswer;
        for (var i = 0; i < correctAnswers.length; i++) {
            console.log(correctAnswers[i])
            // each missing answer (-25)
            if (!selected.includes(correctAnswers[i])){
                curPoints -= 25;

                pointText += "Missing Answer -25\n"
                console.log(pointText)
                console.log("Missing answer! -25, points = " + curPoints);
            }
        }

        console.log("curPoints total before capping: " +  curPoints);

        if (curPoints < 0) { // Cap curPoints at 0 if less than 0
            console.log("Total points under 0! Current points now 0.")
            curPoints = 0;
        }

        // Add curPoints to total points
        const updatedPeople = [...people];
        updatedPeople[meIndex].points = people[meIndex].points + curPoints;
        setPeople(updatedPeople);

        console.log(people);

        // update state of current points for pop up message
        setCurrentPoints(curPoints);
        setPointTextState(pointText)
        
    }
    
    return (
    <div>
    {showGame ? (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h3" style={{ textAlign: "center"}}>
           Round {currentQuestion + 1} of {rounds}
        </Typography>
        <br></br>
            
          <Card elevation={3} style={{ position: 'relative', border: `2px solid var(--text-color)`, borderRadius: "8px" }}>
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
                onClick={() => exitgame_click()} 
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
        <Button
          variant="contained"
          style={{
            width: 230,
            color: 'var(--text-color)',
            backgroundColor: 'var(--accent-color)',
            textTransform: "none",
            fontSize: 15,
            fontWeight: "bold",
            margin: "3%"
          }}
          onClick={handleSubmitButtonClick}
        >
          Submit
        </Button>

        <Dialog open={alertOpen} onClose={handleNextQuestion}>
        <DialogTitle>
        <Typography variant="h3" style={{ textAlign: "center", marginBottom: "-15px" }}>
            Results
        </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            <pre>{pointTextState}</pre>
          </Typography>
         <Typography variant="h4" style={{ textAlign: "center" }}>
            You earned {currentPoints} points in this round!
            Your total points earned in this game are {people[meIndex].points}.
          </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
            style={{
              color: 'var(--text-color)',
              backgroundColor: 'var(--accent-color)',
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }}  
            onClick={handleNextQuestion} >
            Next Question
          </Button>
        </DialogActions>
        </Dialog>

        </div>
    ) : (
        <div>
            <Typography variant="h2" style={{ textAlign: "center" }}>
                Song Roulette Summary
            </Typography>
            <br></br>
            {people.map(person => (
                <div>
                <Typography variant="h3" style={{ textAlign: "center" }}>
                    {person.name} earned {person.points} points!
                </Typography>
                </div>
            ))}
            <br></br>
             <Typography variant="h3" style={{ textAlign: "center" }}>
                {winner} 
            </Typography>
            
        </div>
    )}
    </div>
    );
}

export default SongRouletteGame;
