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
    

    const rounds = location.state.rounds;

    const showRounds = () => {
        console.log(rounds);
    };

    return (
        <div>
        <p>Welcome to Trivia Challenge Game</p>
        <button onClick={showRounds}>Button</button>
        </div>
        );
}

export default TriviaChallengeGame;
