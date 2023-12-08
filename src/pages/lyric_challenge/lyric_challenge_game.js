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
import { useTheme } from '@mui/material/styles';
import FullLogoLight from "../../jukebox_logo_light.png";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, onSnapshot, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../../utils/firebase";
import { UserContext } from "../../App";
import { v4 as uuid } from "uuid";

import CorrectAnswerSound from "../../sounds/correct_answer.mp3";
import WrongAnswerSound from "../../sounds/wrong_answer.mp3";
import FanfareSound from "../../sounds/fanfare.mp3";

function LyricChallengeGame() {
    const location = useLocation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const rounds = location.state.rounds;
    const songbank = location.state.songbank;
    const artists = location.state.artists;
    const songs = location.state.songs;
    const lyrics = location.state.lyrics;

    const [currentQuestion, setCurrentQuestion] = useState(0); // keeps track of question number
    const [showGame, setShowGame] = useState(true); // Determines when quiz ends
    const [selected, setSelected] = useState(""); // Answer the user has selected
    const [alertOpen, setAlertOpen] = useState(false); // Open/close dialog
    const [currentPoints, setCurrentPoints] = useState(0); // Points during each round
    const [totalPoints, setTotalPoints] = useState(0);
    let pointText = ""; // Text in dialog at the end
    const [pointTextState, setPointTextState] = useState(""); 
    const [answers, setAnswers] = useState([]);

    const [highScore, setHighScore] = useState(0);
    const [lyricGamesArray, setLyricGamesArray] = useState([]);

    //answer index keeps track of which song is being asked about
    //default is 0
    //will be randomized for each question
    const length = songbank.length;
    const ans = Math.floor(Math.random() * 10);
    console.log("Answer index is " + ans);
    const [answerIndex, setAnswerIndex] = useState(Math.floor(Math.random() * 10));

    const question = "Can you guess the song based on these lyrics?";

    const createAnswers = (answInd) => {
        var arr = [];
        //make array of song names as possible answers
        arr.push(songs[answInd]);
        while (arr.length < 4) {
            const rand = Math.floor(Math.random() * 10);
            if (arr.indexOf(songs[rand]) == -1) {
                arr.push(songs[rand]);
            }
        }
        console.log(arr);
        setAnswers(arr);
        return arr;
    };

    const checkAnswers = (selected) => {
        console.log("placeholder checkAnswers");
        //checking if song name is correct for lyrics
        if (selected === songs[answerIndex]) {
            setCurrentPoints(50);
            setTotalPoints(totalPoints + 50);
            console.log(currentPoints);
            const audio = new Audio(CorrectAnswerSound);
            audio.play();
        } else {
            setCurrentPoints(0);
            const audio = new Audio(WrongAnswerSound);
            audio.play();
        }
            
            
        
    };

    const handleNextQuestion = async () => { // Change question to next question
        // Increment question when Next Button is pressed
        setAlertOpen(false)
        console.log("nq rounds is " + rounds);
        console.log("nq current question is " + currentQuestion);
        
        // Reset (clearing previous question's selections)
        // reset selected option (for next question)
        setSelected("");
        
        const answ = Math.floor(Math.random() * 10);
        setAnswerIndex(answ);

        const newAns = createAnswers(answ);
        setAnswers(newAns);

        if (currentQuestion == rounds - 1) { // Max rounds reached
            
            
            setShowGame(!showGame);
            const audio = new Audio(FanfareSound);
            audio.play(); 
            await sendGameScore();
            //await getHighScores();
        } 
        else if (currentQuestion < rounds - 1) { // Change question to next question
            console.log("Current question number is " + currentQuestion)
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
        }
    };

    
    const sendGameScore = async () => {
        var hs = 0;
        const docRef = doc(db, "users", user);
        const docSnap = await getDoc(docRef);
        hs = docSnap.data().lyricHighScore;

        if (typeof hs === 'undefined') {
            console.log("lyric high score is undefined");
            hs = 0;
        }
        const gameId = uuid();

        if (totalPoints > hs) {
                
            await updateDoc(docRef, {
                lyricHighScore: totalPoints,
                lyricGameScore: arrayUnion({
                    gameId: gameId,
                    rounds: rounds,
                    score: totalPoints
                })
            }).then(() => console.log("Document updated with new high score"));
        } else {
            await updateDoc(docRef, {
                lyricGameScore: arrayUnion({
                    gameId: gameId,
                    rounds: rounds,
                    score: totalPoints
                })
            }).then(() => console.log("Document updated with no new high score"));
        }
    };
    
    const getHighScores = async () => {
        var lyricHSArray = [];
        console.log("inside High Scores");
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (doc.data().lyricHighScore) {
                console.log("user high score" + doc.data().lyricHighScore);
                lyricHSArray.push({username: doc.data().username, score: doc.data().lyricHighScore});
            }
        });
        lyricHSArray = lyricHSArray.sort((a,b) => b.score - a.score);
        const slicedArray = lyricHSArray.slice(0, 10);
        setLyricGamesArray(slicedArray);
        console.log("getHighScores is working");
        console.log(lyricHSArray);
    };
    
    const handleOptionClick = (answerOption) => {
        console.log(answerOption);
        

        const guessIndex = songs.indexOf(answerOption);
        console.log("Guess index is " + guessIndex)
        setSelected(answerOption);
      
        return;
    };

    const handleSubmitButtonClick = () => { // Shows dialog with everyone's points
        // check user's selection
        checkAnswers(selected);
        setAlertOpen(true);
    };

    const exitgame_click = () => {
        console.log("EXIT GAME CLICKED");
        navigate("/lyricchallengelobby");
    };

    const replayGame = () => {
        console.log("REPLAY GAME CLICKED");
        navigate("/lyricchallengelobby");
    };

    useEffect (() => {
        console.log(rounds);
        console.log(lyrics);
        if (answers.length == 0) {
            var temp = [];
            temp.push(songs[answerIndex]);
            while (temp.length != 4) {
                const rand = Math.floor(Math.random() * 10);
                if (temp.indexOf(songs[rand]) == -1) {
                    temp.push(songs[rand]);
                }
                console.log(temp.length);
            }
            setAnswers(temp);
            console.log(answers);
        }
    }, []);
    
    return (
        <div>
        {showGame ? (
            <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

            <Typography variant="h3" style={{ textAlign: "center"}}>
            Round {currentQuestion + 1} of {rounds}
            </Typography>
            
            <br></br>
            <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px" }}>
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
                {   
                    lyrics[answerIndex].length > 4 ? (
                        <Typography variant="h3" style={{ textAlign: "center"}}>
                            {lyrics[answerIndex][0]}
                            <br></br>
                            {lyrics[answerIndex][1]}
                            <br></br>
                            {lyrics[answerIndex][2]}
                            <br></br>
                            {lyrics[answerIndex][3]}
                        </Typography>
                    ): (
                        <Typography variant="h3" style={{ textAlign: "center"}}>
                            {lyrics[answerIndex][0]}
                            <br></br>
                        </Typography>
                    )  
                }
                
                <br></br>

                <Grid xs={8} sm={6}>
                    {
                        //sort answer by alphabetical order
                        answers.sort((a, b) => a.localeCompare(b)).map(answer => (
                            <Button
                                key={answer}
                                sx={{
                                width: 300,
                                border: `2px solid ${theme.palette.primary.main}`,
                                padding: 1,
                                margin: { xs: 4, sm: 4 },
                                backgroundColor: answer === selected ? 'var(--accent-color)' : 'white',
                                "&:hover": {
                                    backgroundColor: 'var(--accent-color)',
                                },
                                //borderWidth: "2px",
                                }}
                                onClick={() => handleOptionClick(answer)}
                            >
                            {answer}
                            </Button>
                        ))
                    }
                                            

                </Grid>
                
                    
                </CardContent>
            </Card>
            <Button
            variant="contained"
            style={{
                width: 230,
                color: 'theme.palette.secondary.main',
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

            <Dialog open={alertOpen} onClose={handleNextQuestion} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
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
                Your total points earned in this game are {totalPoints}.
            </Typography>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button variant="contained"
                style={{
                color: 'theme.palette.secondary.main',
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
                <br></br>
                <Typography variant="h2" style={{ textAlign: "center" }}>
                    Lyric Challenge Summary
                </Typography>
                <br></br>
                <Typography variant="h3" style={{ textAlign: "center" }}>
                    End of game: You earned {totalPoints} points this game!!!
                </Typography>
                <Button
                    sx={{
                    width: 300,
                    border: `2px solid ${theme.palette.primary.main}`,
                    padding: 1,
                    margin: { xs: 4, sm: 4 },
                    backgroundColor: 'white',
                    "&:hover": {
                        backgroundColor: 'var(--accent-color)',
                    },
                    borderWidth: "2px",
                    }}
                    onClick={replayGame}
                >
                Replay
                </Button>
                {/*
                <h2>Lyric Challenge Leaderboard</h2>
                {
                    lyricGamesArray.map(highScore => (
                        <p>
                            <h3>{highScore.username}: {highScore.score}</h3>
                        </p>
                    ))
                }*/
            }
            </div>
        )}
        </div>
        
        );
    }

export default LyricChallengeGame;