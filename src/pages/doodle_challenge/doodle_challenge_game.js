import Button from "@mui/material/Button";
import React, { useState, useEffect, useContext, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import { useTheme } from '@mui/material/styles';
import { collection, doc, onSnapshot, updateDoc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { UserContext } from "../../App";
import Autocomplete from '@mui/material/Autocomplete';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import EraserIcon from "../../eraser_icon.png";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Timer from '../timeline_challenge/timer';

function DoodleChallengeGame() {

    const theme = useTheme();
    const audioRef = useRef();


    /* Navigation for buttons */
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const [showSongSelection, setShowSongSelection] = useState(true);
    const [showEnd, setShowEnd] = useState(false);

    const songInfoArrayGet = location.state.songInfoArray
    const [songInfoArray, setSongInfoArray] = useState(songInfoArrayGet);
    //console.log("songInfoArray", songInfoArray)
    
    const gameModeGet = location.state.gameMode
    const [gameMode, setGameMode] = useState(gameModeGet);
    
    //console.log("game mode", gameMode)

    const allSongsGet = location.state.allSongs
    const [allSongs, setAllSongs] = useState(allSongsGet);
    //console.log("allSongs", allSongs)

    const randomDoodleGet = location.state.randomDoodle
    const [randomDoodle, setRandomDoodle] = useState(randomDoodleGet);
    //console.log("randomDoodle", randomDoodle)


    const [selectedSong, setSelectedSong] = useState("");

    const exitgame_click = () => {
        console.log("EXIT GAME CLICKED");
        navigate("/doodlechallengelobby");
    };

    const [submitted, setSubmitted] = useState(false)

    const handleOkDialog = () => {
        navigate("/doodlechallengelobby")
    }

    const [username, setUsername] = useState("");

    const getUsername = async () => {
        const userDoc = await getDoc(doc(db, "users", user));
        setUsername(userDoc.data().username);
        console.log("username after getting from firebase: ", username);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        
        // Get the canvas data
        const canvas = canvasRef.current;
        const doodleDataUrl = canvas.toDataURL(); // generate PNG image

        setDoodleImageUrl(doodleDataUrl);
        
        await getUsername();
        
        console.log("username after submitting doodle: ", username);

        const doodleData = {
            username: user,
            doodleUrl: doodleDataUrl,
            selectedSong: selectedSong,
            allSongs: allSongs
          };
      
          // send doodle to Firebase
          try {
            const docRef = await addDoc(collection(db, "doodle"), doodleData);
            console.log("Doodle submitted with ID: ", docRef.id);
          } catch (error) {
            console.error("Error adding doodle: ", error);
          }
    };
        

    const [doodleImageUrl, setDoodleImageUrl] = useState(null);
    
    const colorOptions = ["#ffcd38", "#e9a123", "#b4296c", "#ba3339", "#accea8", "#0d6f4b", "#7fcbd8", "#65a2ac", "#898fd0", "#363b74"]; 

    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const [currentColor, setCurrentColor] = useState("#000000"); // initial color: black

    const [eraser, setEraserMode] = useState(false);

    const setDrawingColor = (color) => {
        setCurrentColor(color);
    };

    const canvasRef = useRef(null);

    const draw = (e) => {
        if (context) {
            if (!isDrawing) return;
        
            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;
        
            context.lineCap = "round";
            if (eraser == true) {
                context.lineWidth = 30;
            } else {
                context.lineWidth = 3; // You can adjust the line width as needed
            }
            context.strokeStyle = currentColor;
        
            context.lineTo(x, y);
            context.stroke();
        }
    };
      
      const clearCanvas = () => {
        if (context) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      
      const startNewPath = () => {
        if (context) {
            context.beginPath();
        }
      };
      
      const drawComplete = () => {
        if (context) {
            context.beginPath();
        }
      };

      const inputRef = useRef(null);
      
      useEffect(() => {
        if (!showSongSelection ) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            setContext(ctx);
        }

      }, [showSongSelection, context]);



      const AudioPlayer = ({ src }) => {
        return (
          <audio controls style={{ width: '400px', borderRadius: '12px', marginTop: "1%", marginRight: "1%" }}>
            <source src={src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      };
    
    
    
      const cardClick = (card) => {
        setSelectedSong(card);
        console.log("clicked song", selectedSong)
        setShowSongSelection(false)
    };

    const handleTimeUp = () => {
        // Logic to execute when the timer is up
        console.log("Time is up!");
        handleSubmit();
      };
    
    return (
        <>

        {gameMode === "Draw" ? (
            showSongSelection ? (
                <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%"}} >
                <Typography variant="h3" style={{ textAlign: "center"}}>
                    Select a song!
                </Typography>

                
                
                <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "5%", marginRight: "5%", display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                
                <br></br>

                {songInfoArray.map((card, index) => (
                    <Card
                    style={{
                    position: 'relative',
                    borderRadius: '12px',
                    backgroundColor: '#282828',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    width: '18%',  
                    height: '370px',                
                    margin: '0 auto',
                    cursor: 'pointer'
                    }}
                >
                    {/* Album Cover */}
                    <img
                    src={card.songAlbumPic}
                    alt="Album Cover"
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '12px',
                        margin: '0 auto',
                    }}
                    />
        
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // center horizontally
                    marginTop: '5%',
                    marginLeft: '1%',
                    flex: 1,
                    }}
                >
                    {/* Song Name */}
                    <Typography variant="h4" style={{ color: 'white', marginBottom: "2%", fontWeight: "bold"}}>{card.songName}</Typography>
        
                    {/* Artist */}
                    <Typography variant="p" style={{ color: 'white', marginBottom: "2%" }}>{card.songArtist}</Typography>
                    
                    <IconButton
                        style={{
                            backgroundColor: '#282828',
                            color: 'white',
                            marginTop: 'auto', 
                        }}
                        onClick={() => cardClick(card)}
                        >
                        <CheckCircleOutlineIcon />
                    </IconButton>
                </div>
        
                </Card>
                ))}
                </div>
                </div>


            ) : (
                <>
                <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>


                <Card elevation={0} style={{ position: 'relative', border: `2px solid ${theme.palette.background.default}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
                    <Typography variant="h3" style={{ textAlign: "center"}}>
                        Draw the song!
                    </Typography>
                    <br></br>

                    <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
                    <br></br>
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

                    <Timer maxTime={120} onTimeUp={handleTimeUp}/>


                    <div
                    style={{
                        position: 'relative',
                        border: `2px solid ${theme.palette.background.default}`,
                        borderRadius: '12px',
                        backgroundColor: '#282828',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '15px',
                        maxWidth: '1060px', 
                        margin: '0 auto',
                    }}
                    >
                    {/* Album Cover */}
                    <img
                        src={selectedSong.songAlbumPic}
                        alt="Album Cover"
                        style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '12px',
                        marginRight: '16px',
                        }}
                    />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginLeft: '1%',
                        flex: 1,
                    }}
                    >
                    {/* Song Name */}
                    <Typography variant="h4" style={{ color: 'white', marginBottom: "2%", fontWeight: "bold"}}>{selectedSong.songName}</Typography>

                    {/* Artist */}
                    <Typography variant="p" style={{ color: 'white', marginBottom: "2%" }}>{selectedSong.songArtist}</Typography>
                    </div>

                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginLeft: '1%',
                        flex: 1, 
                    }}
                    >
                    {/* Use the AudioPlayer component */}
                    <AudioPlayer src={selectedSong.songAudio} />
                    </div>
                    </div>
                    
                    <CardContent>


                
        
                    {/* Drawing Canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{ backgroundColor: "white", border: `4px solid ${theme.palette.primary.main}`, borderRadius: "8px" }}
                        width={1080}
                        height={520}
                        onMouseDown={() => { setIsDrawing(true); startNewPath(); }}
                        onMouseUp={() => { setIsDrawing(false); drawComplete(); }}
                        onMouseMove={draw}
                    />
        
                    <br></br>  
                    <br></br> 
        
                    <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "1080px", margin: "0 auto" }}>
        
                    {/* LEFT SIDE OF DRAWING TOOLS (BRUSH + COLOR OPTIONS) */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Button to choose any color / shows current brush color */}
                        <Button
                        variant="contained"
                        style={{ backgroundColor: theme.palette.background.default, border: `2px solid ${theme.palette.primary.main}`, marginRight: "10px", }}
                        onClick={() => {
                            // Trigger the color input click event
                            setEraserMode(false);
                            inputRef.current.click();
                        }}
                        >
                            <BrushIcon
                                style={{
                                    color: currentColor,
                                    cursor: "pointer",
                                }}
                            />
                            <input
                                ref={inputRef}
                                type="color"
                                style={{
                                    marginRight: "10px",
                                    border: '3px solid var(--line-color)',
                                    padding: "0",
                                    width: "40px",
                                    height: "30px",
                                    display: "none", // Hide the actual input
                                }}
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                            />
                        </Button>
        
                        {/* Buttons for a standard black color option */}
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#000000", marginRight: "10px", padding: "0", minWidth: "40px", minHeight: "30px" }}
                            onClick={() => {
                                setEraserMode(false);
                                setDrawingColor("#000000");
                            }} // Black
                        >
                            <span style={{ width: "40px", height: "30px", display: "inline-block" }}></span>
                        </Button>
        
                        {/* Buttons for some standard color options */}
                        {colorOptions.map((color, index) => (
                            <Button
                            key={index}
                            variant="contained"
                            style={{ backgroundColor: color, marginRight: "10px", padding: "0", minWidth: "40px", minHeight: "30px" }}
                            onClick={() => {
                                setEraserMode(false);
                                setDrawingColor(color);
                            }}
                            >
                                <span style={{ width: "40px", height: "30px", display: "inline-block" }}></span>
                            </Button>
                        ))}
                        </div>
        
                        {/* RIGHT SIDE OF DRAWING TOOLS (ERASER + CLEAR) */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {/* Buttons for eraser option */}
                            <Button
                            variant="contained"
                            style={{ backgroundColor: theme.palette.background.default, border: `2px solid ${theme.palette.primary.main}`, marginRight: "10px",}}
                            onClick={() => {
                                setEraserMode(true);
                                setDrawingColor(theme.palette.background.default);
                            }}
                            >
                                <img
                                    src={EraserIcon}
                                    alt="Eraser"
                                    style={{ width: "24px", height: "24px", cursor: "pointer" }}
                                />
                            </Button>
        
                            {/* Buttons for clear canvas option */}
                            <Button
                            variant="contained"
                            style={{ backgroundColor: theme.palette.background.default, color: theme.palette.primary.main, border: `2px solid ${theme.palette.primary.main}` }}
                            onClick={() => {
                                clearCanvas();
                            }}
                            >
                                <DeleteIcon/>
                            </Button>
                        </div>
                    </div>
        
                    <br></br>
        
                    {doodleImageUrl && (
                    <div>
                        <Dialog open={submitted} onClose={handleOkDialog} maxWidth="md" fullWidth PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
                        <DialogTitle>
                            <Typography variant="h3" style={{ textAlign: "left" }}>
                                Saving your doodle!
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography variant="h4" style={{ textAlign: "left" }}>
                                    Your doodle has been saved and you can view it below. Head back to the lobby to guess some other doodles!
                                </Typography>
                            </DialogContentText>
                        </DialogContent>

                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Card elevation={3} sx={{
                                backgroundColor: theme.palette.background.default,
                                border: `2px solid ${theme.palette.primary.main}`,
                                borderRadius: "8px",
                                height: "100%",
                                width: "80%",
                                }}
                                >
                                <img
                                src={doodleImageUrl}
                                alt="Doodle Preview"
                                style={{ maxWidth: "100%", marginTop: "1%", marginBottom: "1%", marginLeft: "1%", marginRight: "1%" }}
                                />
                            </Card>
                        </div>

                        <br></br>
                    
                        <DialogActions style={{ justifyContent: "center" }}>
                        <Button variant="contained"
                            style={{
                            color: theme.palette.primary.main,
                            backgroundColor: theme.palette.secondary.main,
                            textTransform: "none",
                            fontSize: 15,
                            fontWeight: "bold",
                            marginTop: "1%"
                            }}  
                            onClick={handleOkDialog}>
                            Go to Lobby
                        </Button>
                        </DialogActions>
                        </Dialog>

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
                
                    )}
                
                    </CardContent>

                    </Card>

                    <br></br>

                    <Button variant="contained"
                    style={{
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.secondary.main,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: "2%"
                    }}  
                    onClick={() => handleSubmit()} >
                    Submit
                    </Button>
        
                </Card>
        
                
                </div>
                </>
            )
        ) : (
            <>
            <Typography variant="h3" style={{ textAlign: "center"}}>
                GUESS
            </Typography>

            

            <img
            src={randomDoodle.doodleUrl}
            alt="Doodle Preview"
            style={{ maxWidth: "100%", marginTop: "1%", marginBottom: "1%", marginLeft: "1%", marginRight: "1%" }}
            />
            </>
        )}
        </>
    );
}

export default DoodleChallengeGame;
