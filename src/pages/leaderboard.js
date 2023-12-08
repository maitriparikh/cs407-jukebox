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
import CircularProgress from "@mui/material/CircularProgress";


import { BarChart } from '@mui/x-charts/BarChart';

import { useTheme } from '@mui/material/styles';
import SongRouletteGame from "./song_roulette/song_roulette_game";


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

    const [dataLoaded, setDataLoaded] = useState(false);

    const [loading, setLoading] = useState(true);

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
        const slicedArrayRoulette = rouletteHSArray.slice(0, 10);
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
                setDataLoaded(true); // make sure data loaded before showing leaderboard graphs
                setLoading(false); // for loading icon to display
            }
        })        
    }, [])

    const chartData = {
        songroulette: rouletteGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        doodle: doodleGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        timeline: timelineGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        snippet: snippetGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        trivia: triviaGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        lyric: lyricGamesArray.map((entry) => ({ name: entry.username, score: entry.score })),
        memory: memoryGamesArray.map((entry) => ({ name: entry.username, score: entry.score }))
    };

    return(
        
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>
            {/* 
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
            */}

        <Typography variant="h2" style={{ textAlign: "left" }}>
            Leaderboard 
        </Typography>

        <br></br>

        {loading ? ( // Show loading icon
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
            <div>
            {dataLoaded && (       
            <div>
                {/* SUMMARY LEADERBOARD */}
                {/*}
                <BarChart
                    xAxis={[{ scaleType: 'band', data: ["Lyric Challenge", "Trivia Challenge"] }]}
                    series={[
                        { data: chartData.lyric.map(entry => entry.score) },
                        { data: chartData.trivia.map(entry => entry.score) },
                    ]}
                    width={500}
                    height={300}
                    />
                */}

                

                <Grid container spacing={2}>

                    {/* PERSONAL STATISTICS */}
                    <Grid item xs={6} md={4}>
                    <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <div>
                                <Typography sx={{ color: "#5a2005", marginBottom: "15%" }} variant="h3"> My Playing Statistics </Typography>
                                <Typography sx={{ color: "#5a2005" }} variant="p">Total Rounds Played: {totalRounds} </Typography>
                                <br></br>
                                <Typography sx={{ color: "#5a2005" }} variant="p">Total Points Earned: {totalPoints} </Typography>
                                <br></br>
                                <Typography sx={{ color: "#5a2005" }} variant="p">Avg. Points Per Round: {avgPtsPerRound}</Typography>
                                <br></br>
                            </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* SONG ROULETTE CHALLENGE LEADERBOARD */}
                    <Grid item xs={16} md={8}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Song Roulette Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.songroulette.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.songroulette.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={950}
                                height={200}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* DOODLE CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Doodle Challenge Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.doodle.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.doodle.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* TIMELINE CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Timeline Challenge Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.timeline.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.timeline.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* SNIPPET CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Song Snippet Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.snippet.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.snippet.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* TRIVIA CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Trivia Challenge Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.trivia.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.trivia.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* LYRIC CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Lyric Challenge Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.lyric.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.lyric.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* MEMORY CHALLENGE LEADERBOARD */}
                    <Grid item xs={7} md={4}>
                        <Card
                        elevation={3} sx={{
                            backgroundColor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: "8px",
                            height: "100%",
                            width: "100%",
                        }}>
                            <CardContent>
                            <Typography sx={{ color: "#5a2005" }} variant="h3" component="div">
                                Memory Challenge Leaderboard
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    
                                    data: chartData.memory.map(entry => entry.name),
                                    color: theme.palette.primary.main
                                }]}
                                
                                series={[{ 
                                    data: chartData.memory.map(entry => entry.score), 
                                    color: "#FBE7BF" 
                                }]}
                                width={450}
                                height={300}
                            />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
            )}
            </div>
        )}

        </div>
    );
}

export default Leaderboard;