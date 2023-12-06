import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
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
import { auth, db, storage } from "../../utils/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserContext } from "../../App";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';



function CustomPlaylist() {
    
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [playlist, setPlaylist] = useState("");
    const [playlistEmbed, setPlaylistEmbed] = useState("");
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [invalidLink, setInvalidLink] = useState(false);
    const [finalPlaylist, setFinalPlaylist] = useState([]);
    const [finalPlaylistClean, setFinalPlaylistClean] = useState([]);
    const [allTracks, setAllTracks] = useState([]);


    function getRandomIndex(array) {
        return Math.floor(Math.random() * array.length);
    }

    function extractSpotifyPlaylistID(url) {
        const playlistPrefix = '/playlist/';
        const startIndex = url.indexOf(playlistPrefix);
        if (startIndex === -1) {
            return null; // Playlist prefix not found in the URL
        }
    
        const idStart = startIndex + playlistPrefix.length;
        let idEnd = url.indexOf('?', idStart);
        if (idEnd === -1) {
            idEnd = url.length; // If there's no '?', the ID goes until the end of the URL
        }
    
        return url.substring(idStart, idEnd);
    }

    const handleGoHomepage = () => {
        navigate("/homepage")
    }

    const handleCloseDialog = () => {
        setInvalidLink(false);
    }

    const handleSubmitButtonClick = async () => { 

        // check if real spotify link
        const regex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?$/
        if (!regex.test(playlist)) { // not valid spotify
            console.log("NOT VALID SPOTIFY PLAYLIST")
            setInvalidLink(true);
        }
        else {
            // send to firebase
            // show playlist below
            //https://open.spotify.com/playlist/0PSXEKFjY913mP2IKNEXnf?si=4b7c3e0a41a648c5

            /*
            "https://open.spotify.com/embed/playlist/0PSXEKFjY913mP2IKNEXnf?utm_source=generator"
            */
            let playlistID = extractSpotifyPlaylistID(playlist)
            console.log("playlistID", playlistID)
            let embedLink = "https://open.spotify.com/embed/playlist/" + playlistID + "?utm_source=generator"
            console.log("temp2", embedLink)
            setPlaylistEmbed(embedLink)

            let playlistDataArray = await getPlaylistTracks(playlistID);

            

            // for each playlist get item at tracks > items > # > track and put another data structure

            /* MAKING SURE THERE ARE NO NULL PREVIEWS + FILTERING EXPLICIT */
            playlistDataArray.tracks.items.forEach(trackInPlaylist => {
                if (trackInPlaylist.track.preview_url !== null) {
                    if (!trackInPlaylist.track.explicit) {
                        finalPlaylistClean.push(trackInPlaylist.track);
                    }
                    finalPlaylist.push(trackInPlaylist.track);
                }
            })
      
            //console.log("finalPlaylist", finalPlaylist);
            while (finalPlaylist.length > 20) {
                // get a random track
                const randomIndex = getRandomIndex(finalPlaylist);
                // remove the random track
                finalPlaylist.splice(randomIndex, 1);
            }
            console.log("NEW finalPlaylist AFTER SPLICING", finalPlaylist);

            //console.log("finalPlaylistClean", finalPlaylistClean);
            while (finalPlaylistClean.length > 20) {
                // get a random track
                const randomIndex = getRandomIndex(finalPlaylistClean);
                // remove the random track
                finalPlaylistClean.splice(randomIndex, 1);
            }
            console.log("NEW finalPlaylistClean AFTER SPLICING", finalPlaylistClean);

            // IF LENGTH NOT ENOUGH
            if (finalPlaylist.length < 20 || finalPlaylistClean.length < 20) {
                
                //let playlistExtra1 = await getPlaylistTracks("37i9dQZF1DXcBWIGoYBM5M"); // Top Hits for extra songs
                let playlistExtra = await getPlaylistTracks("37i9dQZF1DXbYM3nMM0oPk"); // Mega Hit Mix for extra songs
                //let playlistExtra3 = await getPlaylistTracks("37i9dQZEVXbNG2KDcFcKOF"); // Top Songs - Global for extra songs
                
                console.log("playlistExtra", playlistExtra)
                
                let playlistExtraFinal = [];

                // Filter for explicit and null tracks in Top Hits
                playlistExtra.tracks.items.forEach(trackInPlaylist => {
                    if (trackInPlaylist.track.preview_url !== null) {
                        if (!trackInPlaylist.track.explicit) {
                            playlistExtraFinal.push(trackInPlaylist.track); // We only get clean songs from Top Tracks
                        }
                    }
                })

                
                while (finalPlaylist.length < 20) {
                    //console.log("INSIDE EXPLICIT WHILE LOOP")
                    const randomIndex = getRandomIndex(playlistExtraFinal);
                    if (!finalPlaylist.some( track => track === playlistExtraFinal[randomIndex])) {
                        finalPlaylist.push(playlistExtraFinal[randomIndex]);
                    } else {
                        //console.log("DUPLICATE", playlistExtraFinal[randomIndex])
                    }
                }
                console.log("finalPlaylist (after adding filler)", finalPlaylist);

                while (finalPlaylistClean.length < 20) {
                    //console.log("INSIDE CLEAN WHILE LOOP")
                    const randomIndex = getRandomIndex(playlistExtraFinal);
                    if (!finalPlaylistClean.some( track => track === playlistExtraFinal[randomIndex])) {
                        finalPlaylistClean.push(playlistExtraFinal[randomIndex]);
                    } else {
                        //console.log("DUPLICATE", playlistExtraFinal[randomIndex])
                    }
                }
                console.log("finalPlaylistClean (after adding filler)", finalPlaylistClean);


            }




            const docRef2 = doc(db, "users", user);
            await updateDoc(docRef2, {
                alternativeSource: true,
                personalSongBank: finalPlaylist,
                personalSongBankClean: finalPlaylistClean
            }).then(() => console.log("Document updated"));
            
            setShowPlaylist(true);
        }
    };

    const getPlaylistTracks = async (playlistID) => {
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
    
        // Step 2: Fetch the playlist data for the given playlist ID
        try {
            const apiUrl = `https://api.spotify.com/v1/playlists/${playlistID}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
    
            const playlistData = await response.json();
            return playlistData; // Return the playlist data
        } catch (error) {
            console.error("Error fetching playlist data:", error);
            return null; // Return null in case of error
        }
    }
    

    return (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Add Your Own Custom Playlist
        </Typography>

        <br></br>

        <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: '20px' }}
        >

        </Grid>

        <Card 
            style={{ 
            height: "100%", 
            border: `3px solid ${theme.palette.primary.main}`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "85%", 
            margin: "0 auto", 
            backgroundColor: theme.palette.background.default
            }}
        >

        <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", paddingBottom: "50px", paddingLeft: "100px", paddingRight: "100px" }}>
            <br></br>
            <Grid item xs={12} style={{ marginTop: "5%", marginBottom: "1%" }}>
                {/* Description */}
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: "16px" }}>
                    If you are connected to Spotify, Jukebox pulls songs from your top songs. Otherwise, Jukebox 
                    uses your results from the Music Preferences Quiz to pull songs. However, if you want Jukebox to use 
                    songs from a your own custom Spotify playlist, enter the link below!
                </Typography>

                <br></br>

                {/* Playlist Field */}
                <TextField
                  label="Your Custom Playlist"
                  style={{ width: "100%", color: 'white'}}
                  InputProps={{ style: { color: theme.palette.primary.main } }} 
                  InputLabelProps={{ shrink: true, style: { color: theme.palette.primary.main } }} 
                  value={playlist}
                  onChange={(event) => setPlaylist(event.target.value)} 
                />

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
                    onClick={handleSubmitButtonClick}
                    >
                    Submit
                </Button>
                
            </Grid>

            {showPlaylist ? (
            <div style={{ marginTop: "2%", marginBottom: "2%", width: "100%"}}>
            <Typography variant="h3" style={{ textAlign: "center", marginBottom: "16px" }}>
                Your Custom Playlist
            </Typography>

            <iframe 
                src={playlistEmbed} 
                width="100%" 
                height="400" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                style={{ border: "none" }}
            >
            </iframe>

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
                onClick={handleGoHomepage}
                >
                Start Playing!
            </Button>
            </div>
            ) : (
                <br></br>
            )}
            </CardContent>
            </Card>

        <Dialog open={invalidLink} onClose={handleCloseDialog} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
        <DialogTitle>
        <Typography variant="h3" style={{ textAlign: "left" }}>
            Invalid Spotify Link
        </Typography>
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h4" style={{ textAlign: "left" }}>
                Please enter a valid link to a public Spotify playlist.
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
            onClick={handleCloseDialog}>
            OK
          </Button>
        </DialogActions>
        </Dialog>

            
   
        </div>
    );
}

export default CustomPlaylist;