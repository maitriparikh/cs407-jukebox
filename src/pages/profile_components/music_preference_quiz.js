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
import { useNavigate } from "react-router-dom";
import ButtonBase from '@mui/material/ButtonBase';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext } from "../../App";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../utils/firebase";

import { useTheme } from '@mui/material/styles';


function MusicPreferencesQuiz() {

    const theme = useTheme();

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [questions, setQuestions] = useState([
        {
          questionText: "What genre(s) of music do you like?",
          answerOptions: [
            { answerText: "Pop", answerFlag: false},
            { answerText: "Rap", answerFlag: false },
            { answerText: "R&B", answerFlag: false },
            { answerText: "Country", answerFlag: false },
            { answerText: "EDM", answerFlag: false },
            { answerText: "Hip Hop", answerFlag: false },
            { answerText: "Jazz", answerFlag: false },
            { answerText: "Classical", answerFlag: false },
          ],
          selected: [
            
          ]
        },
        {
          questionText: "What mood do you prefer for your songs?",
          answerOptions: [
            { answerText: "Happy", answerFlag: false },
            { answerText: "Romantic", answerFlag: false },
            { answerText: "Sad", answerFlag: false },
            { answerText: "Angry", answerFlag: false },
            { answerText: "Depressing", answerFlag: false },
            { answerText: "Energetic", answerFlag: false },
          ],
          selected: [
            
          ]
        },
        {
          questionText: "Who's your favorite artist?",
          answerOptions: [
            { answerText: "Taylor Swift", answerFlag: false },
            { answerText: "Kanye West", answerFlag: false },
            { answerText: "Lil Nas X", answerFlag: false },
            { answerText: "Drake", answerFlag: false },
            { answerText: "Ariana Grande", answerFlag: false },
            { answerText: "Ice Spice", answerFlag: false },
            { answerText: "Nicki Minaj", answerFlag: false },
            { answerText: "BTS", answerFlag: false },
          ],
          selected: [
            
          ]
        },
      ]);

    const [currentQuestion, setCurrentQuestion] = useState(0); // keeps track of question number
    const [showEnd, setShowEnd] = useState(false); // Determines whether ending page is shown or not
    const [noneSelected, setNoneSelected] = useState(false);
    const [isFirstQuestion, setIsFirstQuestion] = useState(true)
    const [submitted, setSubmitted] = useState(false)

    const handleNextButtonClick = (answerOption) => {
        if (questions[currentQuestion].selected.length === 0) {
            setNoneSelected(true);
        } else {
            // Increment question when Next Button is pressed
            setIsFirstQuestion(false);
            
            if (currentQuestion == questions.length - 1) {
            setShowEnd(true);
            } else if (currentQuestion < questions.length - 1) {
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
            }
        }
    };

    const handlePrevButtonClick = (answerOption) => {
        // Decrement question when Prev Button is pressed
        if (currentQuestion == 1) {
            setIsFirstQuestion(true);
        }
        if (currentQuestion > 0) {
            const prevQuestion = currentQuestion - 1;
            setCurrentQuestion(prevQuestion);
            if (showEnd) {
                setShowEnd(false);
                setCurrentQuestion(0);
            }
        } 
    };

    const handleOptionClick = (answerOption) => {

        console.log(answerOption)
        
        const updatedQuestions = [...questions]

        if (!updatedQuestions[currentQuestion].selected.includes(answerOption.answerText)) {
            // Update color of selection
            
            //updatedQuestions[currentQuestion].answerOptions.answerFlag = true;
            answerOption.answerFlag = true

            // Add selected option to selected
            // updatedQuestions[currentQuestion].selected
            updatedQuestions[currentQuestion].selected.push(answerOption.answerText)

            
            
        } else { // deselect answer and remove from selected
            const indexToRemove = updatedQuestions[currentQuestion].selected.indexOf(answerOption.answerText)
            if (indexToRemove !== -1) { // Remove answer option from selected
                updatedQuestions[currentQuestion].selected.splice(indexToRemove, 1);
            }
            answerOption.answerFlag = false

        }

        console.log(updatedQuestions[currentQuestion].selected)
        // update data structure
        setQuestions(updatedQuestions)
   
    };

    const handleNoneSelected = () => {
        setNoneSelected(false);
    }

    const handleSubmit = async () => {


        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
            musicPreferences: questions
        }).then(() => console.log("Document updated"));
        
        setSubmitted(true);
        
    }

    const handleSubmitDialog = () => {
        setSubmitted(false);
        navigate("/profile")
    }

    const handleExit = () => {
        navigate("/profile")
    }

    return (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

            <Typography variant="h2" style={{ textAlign: "center" }}>
                Music Preferences Quiz
            </Typography>

            <br></br>
            <br></br>


        {showEnd ? (
            <div>

            <Dialog open={submitted} onClose={handleSubmitDialog}>
            <DialogContent>
            <DialogContentText>
                <Typography variant="h3" style={{ textAlign: "left" }}>
                    Your Music Preferences have been saved!
                </Typography>
            </DialogContentText>
            </DialogContent>
        
            <DialogActions style={{ justifyContent: "center" }}>
            <Button variant="contained"
                style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold"
                }}  
                onClick={handleSubmitDialog}>
                Return To Profile Page
            </Button>
            </DialogActions>
            </Dialog>

            <Typography variant="h3" style={{ textAlign: "center" }}>
                Your Selections:
            </Typography>
            <br></br>

            <Grid xs={8} sm={6}>
            {questions.map(question => (
                <div>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    {question.questionText}
                </Typography>
                
                <Typography variant="h4" style={{ textAlign: "center" }}>
                    {question.selected.join(', ')}
                </Typography>
                <br></br>
                </div>
            ))}
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
            onClick={handleSubmit}
            >
            Submit My Selections
            </Button>
            </div>

            

        ) : (
        <Stack direction="row" justifyContent="center" alignItems="center">
        
        <Dialog open={noneSelected} onClose={handleNoneSelected} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
        <DialogTitle>
            <Typography variant="h3" style={{ textAlign: "left" }}>
                No Answer Chosen
            </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography variant="h4" style={{ textAlign: "left" }}>
            Please select at least one option to move to the next question.
            </Typography>
          </DialogContentText>
        </DialogContent>
    
        <DialogActions >
          <Button variant="contained"
            style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }}  
            onClick={handleNoneSelected}>
            OK
          </Button>
        </DialogActions>
        </Dialog>

            <ArrowCircleLeftIcon
            variant="contained"
            style={{
                width: 50,
                height: 50,
                color: isFirstQuestion ? 'grey' : 'var(--text-color)',
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                margin: "3%"
            }}

            onClick={handlePrevButtonClick}
            >
            
            </ArrowCircleLeftIcon>
            
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
                onClick={() => handleExit()} 

            />
            
            <CardContent>
            <br></br>

            <Typography variant="h3" style={{ textAlign: "center"}}>    
                {questions[currentQuestion].questionText}
            </Typography>

            <br></br>
            
                <Grid xs={8} sm={6}>
                {questions[currentQuestion].answerOptions.map(
                  (answerOption, index) => (
                    <Button
                      variant="contained"
                      
                      sx={{
                        width: 230,
                        border: `2px solid ${theme.palette.primary.main}`,
                        padding: 1,
                        margin: { xs: 4, sm: 4 },
                        backgroundColor: answerOption.answerFlag ? theme.palette.secondary.main : theme.palette.background.default,
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                        },
                        //borderWidth: "2px",
                        }}
                      onClick={() => handleOptionClick(answerOption)}
                    >
                        {answerOption.answerText}
                    </Button>
                  )
                )}
                </Grid>
            </CardContent>
            </Card>
            
            <ArrowCircleRightIcon
            variant="contained"
            style={{
                width: 50,
                height: 50,
                color: theme.palette.primary.main,
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                margin: "3%"
            }}
            onClick={handleNextButtonClick}
            >
            </ArrowCircleRightIcon>
        </Stack>

        )}
        
              
        </div>
      );
    }
    

export default MusicPreferencesQuiz;