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

import { useTheme } from '@mui/material/styles';



function DailyChallengeGame() {

    const theme = useTheme();

    /* Navigation for buttons */
    const navigate = useNavigate();

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/dailychallengelobby");
    };
    
    const location = useLocation();

    const [isDialogOpen, setDialogOpen] = useState(false);

    const originalWindowWidth = window.innerWidth; // store the original window width

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= originalWindowWidth) {
            setDialogOpen(true);
          } else {
            setDialogOpen(false);
          }
        };
    
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [originalWindowWidth]);
    
      const closeDialog = () => {
        setDialogOpen(false);
      };
    
    return (

        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        {isDialogOpen && (
            <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
            PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}
            >
            <DialogTitle>
                <Typography variant="h3" style={{ textAlign: "left" }}>
                Heads Up!
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                <Typography variant="h4" style={{ textAlign: "left" }}>
                    In order to ensure an optimal playing experience, do not resize the browser window!
                </Typography>
                </DialogContentText>
            </DialogContent>
            </Dialog>
      )}

        <Typography variant="h3" style={{ textAlign: "center"}}>
            Guess the song!
        </Typography>
        <br></br>
            
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
                onClick={() => exitgame_click()} 
            />
            
            <CardContent>
            <br></br>
            <br></br>
            <br></br>

            {/* STAGE 1 - NO HINTS (ONLY AUDIO) */}
            <div style={{ position: 'relative' }}>
                <iframe
                id="spotify-iframe"
                style={{ borderRadius: '12px', width: '90%', height: '320px' }}
                src="https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator&theme=0"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
            
                {/* ALBUM COVER */}
                <div
                style={{
                    position: 'absolute',
                    top: '2%', // Adjust the top position as needed
                    left: '5.5%', // Adjust the left position as needed
                    width: '16.5%', // Adjust the width as needed
                    height: '68%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the album art
                    backgroundColor: 'rgba(0, 0, 0, 1)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* SONG TITLE - NEVER REVEALED */}
                <div
                style={{
                    position: 'absolute',
                    top: '6%', // Adjust the top position as needed
                    left: '22.5%', // Adjust the left position as needed
                    width: '50%', // Adjust the width as needed
                    height: '22%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the artist name
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* ARTIST NAME */}
                <div
                style={{
                    position: 'absolute',
                    top: '30%', // Adjust the top position as needed
                    left: '22.5%', // Adjust the left position as needed
                    width: '20%', // Adjust the width as needed
                    height: '22%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the song name
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* TINY 3 DOT MENU / BOTTOM BAR IDK??  */}
                <div
                style={{
                    position: 'absolute',
                    top: '55%', // Adjust the top position as needed
                    left: '22%', // Adjust the left position as needed
                    width: '69%', // Adjust the width as needed
                    height: '13%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // yellow background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // grey background
                }}
                ></div>
                {/* ALBUM DISPLAY ON RIGHT SIDE */}
                <div
                style={{
                    position: 'absolute',
                    top: '1%', // Adjust the top position as needed
                    left: '75%', // Adjust the left position as needed
                    width: '20%', // Adjust the width as needed
                    height: '51%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // Translucent background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
            </div>

            {/* STAGE 2 - 1 HINT (+ ARTIST NAME(S)) */}
            <div style={{ position: 'relative' }}>
                <iframe
                id="spotify-iframe"
                style={{ borderRadius: '12px', width: '90%', height: '320px' }}
                src="https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator&theme=0"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
                
                {/* ALBUM COVER */}
                <div
                style={{
                    position: 'absolute',
                    top: '2%', // Adjust the top position as needed
                    left: '5.5%', // Adjust the left position as needed
                    width: '16.5%', // Adjust the width as needed
                    height: '68%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the album art
                    backgroundColor: 'rgba(0, 0, 0, 1)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* SONG TITLE - NEVER REVEALED */}
                <div
                style={{
                    position: 'absolute',
                    top: '6%', // Adjust the top position as needed
                    left: '22.5%', // Adjust the left position as needed
                    width: '50%', // Adjust the width as needed
                    height: '22%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the artist name
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* TINY 3 DOT MENU / BOTTOM BAR IDK??  */}
                <div
                style={{
                    position: 'absolute',
                    top: '55%', // Adjust the top position as needed
                    left: '22%', // Adjust the left position as needed
                    width: '69%', // Adjust the width as needed
                    height: '13%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // yellow background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // grey background
                }}
                ></div>
                {/* ALBUM DISPLAY ON RIGHT SIDE */}
                <div
                style={{
                    position: 'absolute',
                    top: '1%', // Adjust the top position as needed
                    left: '75%', // Adjust the left position as needed
                    width: '20%', // Adjust the width as needed
                    height: '51%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // Translucent background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
            </div>

            {/* STAGE 3 - 2 HINTs (+ ALBUM COVER) */}
            <div style={{ position: 'relative' }}>
                <iframe
                id="spotify-iframe"
                style={{ borderRadius: '12px', width: '90%', height: '320px' }}
                src="https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator&theme=0"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
                
                {/* SONG TITLE - NEVER REVEALED */}
                <div
                style={{
                    position: 'absolute',
                    top: '6%', // Adjust the top position as needed
                    left: '22.5%', // Adjust the left position as needed
                    width: '50%', // Adjust the width as needed
                    height: '22%', // Adjust the height as needed
                    backdropFilter: 'blur(40px)', // Apply a blur effect to cover the artist name
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
                {/* TINY 3 DOT MENU / BOTTOM BAR IDK??  */}
                <div
                style={{
                    position: 'absolute',
                    top: '55%', // Adjust the top position as needed
                    left: '22%', // Adjust the left position as needed
                    width: '69%', // Adjust the width as needed
                    height: '13%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // yellow background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // grey background
                }}
                ></div>
                {/* ALBUM DISPLAY ON RIGHT SIDE */}
                <div
                style={{
                    position: 'absolute',
                    top: '1%', // Adjust the top position as needed
                    left: '75%', // Adjust the left position as needed
                    width: '20%', // Adjust the width as needed
                    height: '51%', // Adjust the height as needed
                    backdropFilter: 'blur(100px)', // Apply a blur effect to cover the song name
                    //backgroundColor: 'rgba(255, 191, 0, 0.9)', // Translucent background
                    backgroundColor: 'rgba(36, 36, 36, 1)', // Translucent background
                    borderRadius: '12px'
                }}
                ></div>
            </div>

            </CardContent>
        </Card>
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
        >
        Submit
        </Button>

        </div>
    );
}

export default DailyChallengeGame;
