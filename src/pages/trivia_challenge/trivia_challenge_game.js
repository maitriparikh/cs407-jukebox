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

function TriviaChallengeGame() {
    const location = useLocation();
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [albumNames, setAlbumNames] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [albumImages, setAlbumImages] = useState([]);


    const rounds = location.state.rounds;
    const songbank = location.state.songbank;

    const getArtists = () => {
        var total = [];
        const firstString = "https://open.spotify.com/embed/track/"
        const secondString = "?utm_source=generator"
        for (let i = 0; i < songbank.length; i++) {
            var arr = [];
            for (let j = 0; j < songbank[i].artists.length; j++) {
                arr.push(songbank[i].artists[j].name);
            }
            total.push(arr);
        }
        setArtists(total);
        console.log(artists);
    };

    const getSongs = () => {
        var total = [];
        for (let i = 0; i < songbank.length; i++) {
            total.push(songbank[i].name);
        }
        setSongs(total);
        console.log(songs);
    };

    const getAlbumInfo = () => {
        var names = [];
        var images = [];
        for (let i = 0; i < songbank.length; i++) {
            names.push(songbank[i].album.name);
            images.push(songbank[i].album.images[0]);
        }
        setAlbumNames(names);
        setAlbumImages(images);
        console.log(albumNames);
        console.log(albumImages);
    }

    const getPreviews = () => {
        var total = [];
        for (let i = 0; i < songbank.length; i++) {
            total.push(songbank[i].preview_url);
        }
        setPreviews(total);
        console.log(previews);
    }

    const showRounds = () => {
        getArtists();
        getSongs();
        getAlbumInfo();
        getPreviews();
    };

    return (
        <div>
        <p>Welcome to Trivia Challenge Game</p>
        <button onClick={showRounds}>Button</button>
        </div>
        );
}

export default TriviaChallengeGame;
