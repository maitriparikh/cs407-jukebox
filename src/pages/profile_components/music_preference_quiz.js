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
    const [finalPlaylist, setFinalPlaylist] = useState([]);
    const [questions, setQuestions] = useState([
        {
          questionText: "What genre(s) of music do you like?",
          answerOptions: [
            { answerText: "Pop", answerFlag: false, playlistID: '37i9dQZF1EQncLwOalG3K7'},
            { answerText: "Rap", answerFlag: false, playlistID: '37i9dQZF1EIgbjUtLiWmHt' },
            { answerText: "R&B", answerFlag: false, playlistID: '37i9dQZF1EQoqCH7BwIYb7' },
            { answerText: "Country", answerFlag: false, playlistID: '37i9dQZF1EQmPV0vrce2QZ' },
            { answerText: "EDM", answerFlag: false, playlistID: '37i9dQZF1EIgSbGto0qEjK' },
            { answerText: "Hip Hop", answerFlag: false, playlistID: '37i9dQZF1EQnqst5TRi17F' },
            { answerText: "Jazz", answerFlag: false, playlistID: '37i9dQZF1EQqA6klNdJvwx' },
            { answerText: "Classical", answerFlag: false, playlistID: '37i9dQZF1EQn1VBR3CMMWb' },
          ],
          selected: [
            
          ]
        },
        {
          questionText: "What mood do you prefer for your songs?",
          answerOptions: [
            { answerText: "Happy", answerFlag: false, playlistID: '37i9dQZF1EVJSvZp5AOML2' },
            { answerText: "Romantic", answerFlag: false, playlistID: '37i9dQZF1EVGJJ3r00UGAt' },
            { answerText: "Sad", answerFlag: false, playlistID: '37i9dQZF1EIdChYeHNDfK5' },
            { answerText: "Angry", answerFlag: false, playlistID: '37i9dQZF1EIgNZCaOGb0Mi' },
            { answerText: "Depressing", answerFlag: false, playlistID: '37i9dQZF1EIfv2exTKzl3M' },
            { answerText: "Energetic", answerFlag: false, playlistID: '37i9dQZF1EIcVD7Tg8a0MY' },
          ],
          selected: [
            
          ]
        },
        {
          questionText: "Who's your favorite artist?",
          answerOptions: [
            { answerText: "Taylor Swift", answerFlag: false, playlistID: '37i9dQZF1DX5KpP2LN299J' },
            { answerText: "The Weeknd", answerFlag: false, playlistID: '37i9dQZF1DX6bnzK9KPvrz' },
            { answerText: "Lana Del Rey", answerFlag: false, playlistID: '37i9dQZF1DZ06evNZVVBPG' },
            { answerText: "Dua Lipa", answerFlag: false, playlistID: '37i9dQZF1DX3fRquEp6m8D' },
            { answerText: "Drake", answerFlag: false, playlistID: '37i9dQZF1DX7QOv5kjbU68' },
            { answerText: "Travis Scott", answerFlag: false, playlistID: '37i9dQZF1DZ06evO0vGf4I' },
            { answerText: "Ariana Grande", answerFlag: false, playlistID: '37i9dQZF1DX1PfYnYcpw8w' },
            { answerText: "Doja Cat", answerFlag: false, playlistID: '37i9dQZF1DZ06evO33svt5' },
            { answerText: "BTS", answerFlag: false, playlistID: '37i9dQZF1DX08mhnhv6g9b' },
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

        /* CREATE DATA STRUCTURE like top5songs */
        
        // in selected field of question: get playlistID of each selected answer
        
        let playlistIDs = [];
        questions.forEach(question => {
            question.selected.forEach(selectedAnswerText => {
            const matchingAnswerOption = question.answerOptions.find(answerOption => answerOption.answerText === selectedAnswerText);
            if (matchingAnswerOption) {
                playlistIDs.push(matchingAnswerOption.playlistID);
            }
            });
        });
        console.log("PLAYLIST IDS", playlistIDs)

        // get an array with [category: all category tracks, category: all category tracks, ...]
        let playlistDataArray = await getAllPlaylistTracks(playlistIDs);
        console.log("playlistDataArray", playlistDataArray)

        // for each playlist get item at # > tracks > items > # > track and put another data structure
        let tracksWeWant = [];
        playlistDataArray.forEach(playlist => {
            playlist.tracks.items.forEach(trackInPlaylist => {
                tracksWeWant.push(trackInPlaylist.track);
                finalPlaylist.push(trackInPlaylist.track);
            })
        })
        console.log("tracksWeWant", tracksWeWant)
        
        // make finalPlaylist all the combined playlist tracks
        //setFinalPlaylist(tracksWeWant);
        console.log("finalPlaylist", finalPlaylist);

        while (finalPlaylist.length > 5) {
            // get a random track
            const randomIndex = getRandomIndex(finalPlaylist);
            // remove the random track
            finalPlaylist.splice(randomIndex, 1);
        }

        console.log("NEW finalPlaylist AFTER SPLICING", finalPlaylist);
        
        setSubmitted(true);

        const docRef2 = doc(db, "users", user);
        await updateDoc(docRef2, {
            musicPreferencesPlaylist: finalPlaylist
        }).then(() => console.log("Document updated"));
        
    }

    function getRandomIndex(array) {
        return Math.floor(Math.random() * array.length);
    }

    const handleSubmitDialog = () => {
        setSubmitted(false);
        navigate("/profile")
    }

    const handleExit = () => {
        navigate("/profile")
    }

    const getAllPlaylistTracks = async (playlistIDs) => {
        const clientId = '58126bf99c20469d8a94ca07a7dada0a';
        const clientSecret = 'cd744e259b8b4d45a12752deaf395c11';

        // Step 1: Obtain an access token using the Client Credentials Flow
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=client_credentials',
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
        console.error('Failed to obtain access token');
        return null;
        }

        // const playlistIDs = [POP, RAP, R&B, COUNTRY, EDM, HIP HOP, JAZZ, CLASSICAL]; // playlist IDs acc to answer choices
        //const playlistIDs = ['37i9dQZF1EQncLwOalG3K7', '37i9dQZF1EIgbjUtLiWmHt', '37i9dQZF1EQoqCH7BwIYb7', '37i9dQZF1EQmPV0vrce2QZ', '37i9dQZF1EIgSbGto0qEjK', '37i9dQZF1EQnqst5TRi17F', '37i9dQZF1EQqA6klNdJvwx', '37i9dQZF1EQn1VBR3CMMWb']; 
        const playlistDataPromises = playlistIDs.map(async (playlistID) => {
            const apiUrl = `https://api.spotify.com/v1/playlists/${playlistID}`;
            const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
            },
            method: 'GET',
            });

                return res.json();
        });

        try {
            // Wait for all playlist data requests to complete
            const playlistDataArray = await Promise.all(playlistDataPromises);
    
            // Combine all playlist data into a single array
            let combinedPlaylistArray = playlistDataArray.map(playlistData => playlistData);
    
            // Return the combined array
            return combinedPlaylistArray;
        } catch (error) {
            console.error("Error fetching playlist data:", error);
            return []; // Return an empty array in case of error
        }

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