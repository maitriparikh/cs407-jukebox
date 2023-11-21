import React, { useState, useEffect, createContext, useContext } from "react";
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext } from "../App";
import { auth, db } from "../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from '@mui/material/styles';
export var TopFiveArrExport = true;


function Homepage() {

    const theme = useTheme();

    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false); // show dialog for if spotify is not connected
    const [spotifyConnected, setSpotifyConnected] = useState(false); // is spotify connected?
    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [preferencesQuiz, setPreferencesQuiz] = useState(false); // is music preferences quiz done? (done will mean custom playlist(s) is generated)
    const [musicPreferences, setMusicPreferences] = useState(""); // Music Preferences
    const { user, setUser } = useContext(UserContext);
    const [topFiveArr, setTopFiveArr] = useState("");
    const [finalPlaylist, setFinalPlaylist] = useState([]);
    const [finalPlaylistClean, setFinalPlaylistClean] = useState([]);
    const [altSource, setAltSource] = useState(false); // is alternate source being used?


    const gameCardHover = {
      transition: "transform 0.2s", 
      "&:hover": {
        transform: "scale(1.05)", 
      },
  };

  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

    // to track which game is selected
    const [game, setChosenGame] = useState('');

    // for a random game selection
    const gameNames = [
      "Daily Challenge",
      "Song Roulette",
      "Pictionary",
      "Song Snippet",
      "Trivia Challenge",
      "Lyric Challenge",
    ];

    const getSpotifyToken = async () => {
      const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
        setSpotifyToken(doc.data().spotifyToken);
        setAltSource(doc.data().alternativeSource)
        console.log("spotify token got ->", spotifyToken)
      });
    }

    const fetchWebApi = async (endpoint, method, body) => {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}}`,
        },
        method,
        body:JSON.stringify(body)
      });
      return await res.json();
    }

    const getTopTracks = async () => {
      return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=50', 'GET')).items; // get 100 but send 20
    }

    const displayTop = async() => {
      const topTracks = await getTopTracks();
      console.log("The top tracks are: ", topTracks);
      TopFiveArrExport = topTracks;
      setTopFiveArr(topTracks);
      console.log(topFiveArr);
      if (topTracks != undefined) {

        // filter out null previews + create clean playlist
        topTracks.forEach(song => {
          if (song.preview_url !== null) {
            if (!song.explicit) {
                finalPlaylistClean.push(song);
            }
            finalPlaylist.push(song);
          }
        })

        console.log("finalPlaylist", finalPlaylist);
        while (finalPlaylist.length > 20) {
            // get a random track
            const randomIndex = getRandomIndex(finalPlaylist);
            // remove the random track
            finalPlaylist.splice(randomIndex, 1);
        }
        console.log("NEW finalPlaylist AFTER SPLICING", finalPlaylist);

        console.log("finalPlaylistClean", finalPlaylistClean);
        while (finalPlaylistClean.length > 20) {
            // get a random track
            const randomIndex = getRandomIndex(finalPlaylistClean);
            // remove the random track
            finalPlaylistClean.splice(randomIndex, 1);
        }
        console.log("NEW finalPlaylistClean AFTER SPLICING", finalPlaylistClean); 


        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          topFive: topTracks,
          personalSongBank: finalPlaylist,
          personalSongBankClean: finalPlaylistClean,
        }, {
          merge: true
        }).then(() => {
          console.log("Document updated")
        }).catch((error) => {
          console.log("There was an error updating the doc with spotify token");
        });
      }
      
      
     /*
      console.log(
        topTracks?.map(
          ({name, artists}) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
        )
      );
      */
    }

    useEffect(()=>{
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          setUser(user.uid);
          console.log("the profile passed thru uid is: ", user.uid);

          await onSnapshot(doc(db, "users", user.uid), async (doc) => {

            // SPOTIFY TOKEN FROM FIREBASE
            setSpotifyToken(doc.data().spotifyToken);
            setAltSource(doc.data().alternativeSource)
            if (spotifyToken != "") {
              console.log("spotify token got in choose game ->", spotifyToken);
              setSpotifyConnected(true);
              console.log("spotify token set to true", spotifyConnected);
  
              //try to get top 5 songs
              
              //const addTopFive = await displayTop();
            } else {
              setSpotifyConnected(false);
            }

            // MUSIC PREFERENCES FROM FIREBASE
            setMusicPreferences(doc.data().musicPreferences);
            if (musicPreferences) {
              console.log("music preferences got in choose game ->", musicPreferences);
              setPreferencesQuiz(true);
              console.log("preferences quiz set to true", preferencesQuiz);
            } else {
              setPreferencesQuiz(false);
            }


            console.log("spotify token got ->", spotifyToken);
          });

          
        } else {
          console.log("auth state where no user");
          navigate("/");
        }
      })

    }, [spotifyToken]);


    const chooseGame = async (game) => {
      //if connected to spotify
      console.log("ALTERNATIVESOURCE LKDJFLSJDFkSDJF", altSource)
      if (!altSource) { // if there is no custom playlist or music preference quiz recently
        //console.log("ALTERNATIVESOURCE LKDJFLSJDFkSDJF", altSource)
        await displayTop();
      }
      console.log("SPOTIFY CONNECTED VALUE: ", spotifyConnected);
      console.log("MUSIC PREFERENCES VALUE: ", musicPreferences);
      if (spotifyConnected || musicPreferences) {
        // random button clicked
        if (game == "Random") {
          // generate a random number from 0-5 (array indices corresponding to games in gameNames array)
          console.log('Random Game Chosen!');
          const num = Math.floor(Math.random() * 6);
          game = gameNames[num];
        }
        console.log('Game Chosen:', game);
        setChosenGame(game);
        if (game == "Song Roulette") {
          navigate("/songroulettelobbybrowser");
        } 
        else if (game == "Daily Challenge") {
          navigate("/dailychallengelobby");
        } else if (game == "Pictionary") {
          navigate("/pictionarylobby");
        } else if (game == "Song Snippet") {
          navigate("/songsnippetlobby");
        } else if (game == "Trivia Challenge") {
          navigate("/triviachallengelobby");
        } else if (game == "Lyric Challenge") {
          navigate("/lyricchallengelobby");
        } 
      }
      else {
        // if not connected to spotify or music preferences quiz not done, show dialog
        console.log("NO SPOTIFY CONNECTED AND MUSIC PREFERENCES QUIZ NOT DONE")
        setAlertOpen(true)
      }

    }
    
    const handleDialogProfile = () => {
      navigate("/profile");
    }

    const handleDialogStayOnHomepage = () => {
      setAlertOpen(false)
    }

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Homepage
        </Typography>

        <br></br>

        <Dialog open={alertOpen} onClose={handleDialogStayOnHomepage} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
        <DialogTitle>
        <Typography variant="h3" style={{ textAlign: "left" }}>
          You need to complete your music profile to play a game!
        </Typography>
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography variant="h4" style={{ textAlign: "left" }}>
            Follow the link to your profile page to connect your Spotify account or take a music preferences quiz and start playing!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
            style={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }} 
            onClick={handleDialogStayOnHomepage}>
            Not Now
          </Button>
          <Button variant="contained"
            style={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }} 
            onClick={handleDialogProfile}>
            Go to Profile
          </Button>
        </DialogActions>
        </Dialog>

        <Button
          sx={{
            width: "15%",
            marginBottom: "20px",
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            transition: "border-color 0.3s, background-color 0.3s",
            backgroundColor: theme.palette.secondary.main,
            textTransform: "none",
            fontSize: 20,
            fontWeight: "bold",
            position: "relative",
            "&:hover": {
              animation: "flash 1s infinite", 
            },
            "@keyframes flash": {
              "0%": {
                backgroundColor: theme.palette.secondary.main,
              },
              "50%": {
                backgroundColor: "var(--line-color)",
              },
              "100%": {
                backgroundColor: theme.palette.secondary.main,
              },
            },
            
          }}
          onClick={() => chooseGame("Random")}
        >
          Random 🔀
        </Button>
        <br></br>
        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Daily Challenge")}
            >
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Daily Challenge
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Song Roulette")}>
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Song Roulette 👥
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Pictionary")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Pictionary 👥
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
    
          {/* Second Row */}
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Song Snippet")}>
              <CardContent>
                <ButtonBase>
                <Typography variant="h3" component="div">
                  Song Snippet
                </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Trivia Challenge")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Trivia Challenge
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} sx={{
              ...gameCardHover,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              height: "250px",
              width: "100%",
            }}
            onClick={() => chooseGame("Lyric Challenge")}>
              <CardContent>
              <ButtonBase>
                <Typography variant="h3" component="div">
                  Lyric Challenge
                </Typography>
              </ButtonBase>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </div>
      );
    }
    

export default Homepage;