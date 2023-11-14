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
    const [totalRounds, setTotalRounds] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [avgPtsPerRound, setAvgPtsPerRound] = useState(0);

    const averagePointsPerRound = (totalPts, totalRound) => {
        return (totalPts / totalRound);
    }

    const triviaChallengeStats = (triviaArray) => {
        if (triviaArray.length != 0) {
            var pts = 0;
            var rds = 0;
            for (let i = 0; i < triviaArray.length; i++) {
                console.log(parseInt(triviaArray[i].rounds, 10));
                console.log(parseInt(triviaArray[i].score, 10));
                rds += parseInt(triviaArray[i].rounds, 10);
                pts += parseInt(triviaArray[i].score, 10);
            }
            setAvgPtsPerRound(Math.round(averagePointsPerRound(pts, rds) * 100) / 100);
            setTotalRounds(rds);
            setTotalPoints(pts);
        }
    }

    const getHighScores = async () => {
        var triviaHSArray = [];
        console.log("inside High Scores");
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            if (doc.data().triviaHighScore) {
                console.log("user high score" + doc.data().triviaHighScore);
                triviaHSArray.push({username: doc.data().username, score: doc.data().triviaHighScore});
            }
        });
        triviaHSArray = triviaHSArray.sort((a,b) => b.score - a.score);
        const slicedArray = triviaHSArray.slice(0, 10);
        setTriviaGamesArray(slicedArray);
    }

    useEffect (() => {
        onAuthStateChanged (auth, async (user) => {
            if (user) {
                setUser(user.uid);
                await onSnapshot(doc(db, "users", user.uid), async (doc) => {
                    setTriviaGamesArray(doc.data().triviaGameScore);
                    console.log(doc.data().triviaGameScore);
                    triviaChallengeStats(doc.data().triviaGameScore);
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
                    <h2>Trivia Challenge Leaderboard</h2>
                    {
                        triviaGamesArray.map(highScore => (
                            <p>
                                <h3>{highScore.username}: {highScore.score}</h3>
                            </p>

                        ))
                    }
                </div>
            </div>
            <br></br>
            <div>
                <h1>Playing Statisitics</h1>
                <div>
                    <h2>Trivia Challenge Statisitics</h2>
                    <div>
                        <h3>Total Rounds: {totalRounds} </h3>
                        <h3>Total Points: {totalPoints} </h3>
                        <h3>Average Points Per Round (Max is 50 points): {avgPtsPerRound}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;