import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../logo.png';
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { auth, db, storage } from "../utils/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserContext } from "../App";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { useTheme } from '@mui/material/styles';


function Leaderboard() {
    const theme = useTheme();

    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");
    const [image, setImage] = useState("");
    const [triviaGamesArray, setTriviaGamesArray] = useState([]);
    const [snippetGamesArray, setSnippetGamesArray] = useState([]);
    const [lyricGamesArray, setLyricGamesArray] = useState([]);
    const [memoryGamesArray, setMemoryGamesArray] = useState([]);
    const [doodleGamesArray, setDoodleGamesArray] = useState([]);
    const [rouletteGamesArray, setRouletteGamesArray] = useState([]);
    const [timelineGamesArray, setTimelineGamesArray] = useState([]);


    const [totalRounds, setTotalRounds] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [avgPtsPerRound, setAvgPtsPerRound] = useState(0);

    const averagePointsPerRound = (totalPts, totalRound) => {
        return (totalPts / totalRound);
    }

    const totalStats = (array) => {
        var totalPoints = 0;
        var totalRounds = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (typeof array[i][j].rounds !== 'undefined') {
                    //totalPoints += array[i][j].score;
                    totalPoints += parseInt(array[i][j].score, 10);
                    //totalRounds += array[i][j].rounds;
                    totalRounds += parseInt(array[i][j].rounds, 10);
                } else {
                    totalPoints += parseInt(array[i][j].score, 10);
                    totalRounds++;
                }
            }
        }
        setTotalRounds(totalRounds);
        setTotalPoints(totalPoints);
        setAvgPtsPerRound(Math.round(averagePointsPerRound(totalPoints, totalRounds) * 100) / 100);
    }

    const getHighScores = async () => {
        var triviaHSArray = [];
        var snippetHSArray = [];
        var lyricHSArray = [];
        var rouletteHSArray = [];
        var memoryHSArray = [];
        var timelineHSArray = [];
        var doodleHSArray = [];
        

        console.log("inside High Scores");
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            
            if (doc.data().triviaHighScore) {
                console.log("user high score" + doc.data().triviaHighScore);
                triviaHSArray.push({username: doc.data().username, score: doc.data().triviaHighScore});
            }
            if (doc.data().snippetHighScore) {
                snippetHSArray.push({username: doc.data().username, score: doc.data().snippetHighScore});
                console.log("there was smth here");
            }
            if (doc.data().lyricHighScore) {
                lyricHSArray.push({username: doc.data().username, score: doc.data().lyricHighScore});
                console.log("there was smth here");
            }
            if (doc.data().rouletteHighScore) {
                rouletteHSArray.push({username: doc.data().username, score: doc.data().rouletteHighScore});
                console.log("there was smth here");
            }
            if (doc.data().memoryHighScore) {
                memoryHSArray.push({username: doc.data().username, score: doc.data().memoryHighScore});
                console.log("there was smth here");
            }
            if (doc.data().timelineHighScore) {
                timelineHSArray.push({username: doc.data().username, score: doc.data().timelineHighScore});
                console.log("there was smth here");
            }
            if (doc.data().doodleHighScore) {
                doodleHSArray.push({username: doc.data().username, score: doc.data().doodleHighScore});
                console.log("there was smth here");
            }
        });
        triviaHSArray = triviaHSArray.sort((a,b) => b.score - a.score);
        snippetHSArray = snippetHSArray.sort((a,b) => b.score - a.score);
        lyricHSArray = lyricHSArray.sort((a,b) => b.score - a.score);

        rouletteHSArray = rouletteHSArray.sort((a,b) => b.score - a.score);
        memoryHSArray = memoryHSArray.sort((a,b) => b.score - a.score);
        timelineHSArray = timelineHSArray.sort((a,b) => b.score - a.score);
        doodleHSArray = doodleHSArray.sort((a,b) => b.score - a.score);

        //gets top 3 scores
        const topNum = 3;
        const slicedArrayTrivia = triviaHSArray.slice(0, topNum);
        const slicedArraySnippet = snippetHSArray.slice(0, topNum);
        const slicedArrayLyric = lyricHSArray.slice(0, topNum);
        const slicedArrayRoulette = rouletteHSArray.slice(0, topNum);
        const slicedArrayMemory = memoryHSArray.slice(0, topNum);
        const slicedArrayTimeline = timelineHSArray.slice(0, topNum);
        const slicedArrayDoodle = doodleHSArray.slice(0, topNum);


        setTriviaGamesArray(slicedArrayTrivia);
        setSnippetGamesArray(slicedArraySnippet);
        setLyricGamesArray(slicedArrayLyric);
        setRouletteGamesArray(slicedArrayRoulette);
        setMemoryGamesArray(slicedArrayMemory);
        setTimelineGamesArray(slicedArrayTimeline);
        setDoodleGamesArray(slicedArrayDoodle);
    }

    useEffect (() => {
        onAuthStateChanged (auth, async (user) => {
            if (user) {
                setUser(user.uid);
                await onSnapshot(doc(db, "users", user.uid), async (doc) => {
                    
                    var gameScores = [];
                    if (typeof doc.data().triviaGameScore !== 'undefined') {
                        gameScores.push(doc.data().triviaGameScore);
                    }
                    if (typeof doc.data().snippetGameScore !== 'undefined') {
                        gameScores.push(doc.data().snippetGameScore);
                    }
                    if (typeof doc.data().rouletteGameScore !== 'undefined') {
                        gameScores.push(doc.data().rouletteGameScore);
                    }
                    if (typeof doc.data().lyricGameScore !== 'undefined') {
                        gameScores.push(doc.data().lyricGameScore);
                    }
                    if (typeof doc.data().doodleGameScore !== 'undefined') {
                        gameScores.push(doc.data().doodleGameScore);
                    }
                    if (typeof doc.data().memoryGameScore !== 'undefined') {
                        gameScores.push(doc.data().memoryGameScore);
                    }
                    if (typeof doc.data().timelineGameScore !== 'undefined') {
                        gameScores.push(doc.data().timelineGameScore);
                    }

                    totalStats(gameScores);

                    //setLyricGamesArray(doc.data().triviaGameScore);
                    //console.log(doc.data().triviaGameScore);



                    //triviaChallengeStats(doc.data().triviaGameScore);
                });
                await getHighScores();
            }
        })        
    }, [])

    return(
        
        <div>
            <div>
                <h1>Music Game Leaderboards</h1>
                <div>
                    <h2>Song Roulette Leaderboard</h2>
                    {
                        typeof rouletteGamesArray !== 'undefined'? (
                            rouletteGamesArray.map(highScore => (
                                <p>
                                    <h3>{highScore.username}: {highScore.score}</h3>
                                </p>
    
                            ))
                        ): (
                            <p></p>
                        )
                        
                    }
                    <h2>Doodle Challenge Leaderboard</h2>
                    {
                        doodleGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }

                    <h2>Timeline Challenge Leaderboard</h2>
                    {
                        timelineGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }
                    <h2>Song Snippet Leaderboard</h2>
                    {
                        snippetGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }
                    <h2>Trivia Challenge Leaderboard</h2>
                    {
                        triviaGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }
                    <h2>Lyric Challenge Leaderboard</h2>
                    {
                        typeof lyricGamesArray !== 'undefined'? (
                            lyricGamesArray.map(highScore => (
                                <p>
                                    <h3>{highScore.username}: {highScore.score}</h3>
                                </p>
    
                            ))
                        ): (
                            <p></p>
                        )
                        
                    }

                    <h2>Memory Challenge Leaderboard</h2>
                    {
                        memoryGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }
                </div>
            </div>
            <br></br>
            <div>
                <h1>Overall Playing Statisitics</h1>
                <div>
                    <h3>Total Rounds: {totalRounds} </h3>
                    <h3>Total Points: {totalPoints} </h3>
                    <h3>Average Points Per Round: {avgPtsPerRound}</h3>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;