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
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { UserContext } from "../../App";
import Autocomplete from '@mui/material/Autocomplete';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import EraserIcon from "../../eraser_icon.png";

function PictionaryGame() {

    const theme = useTheme();

    /* Navigation for buttons */
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    const exitgame_click = () => {
        console.log("EXIT GAME CLICKED");
        navigate("/pictionarylobby");
      };
    
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
      };
      
      const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
      
      const startNewPath = () => {
        context.beginPath();
      };
      
      const drawComplete = () => {
        context.beginPath();
      };

      const inputRef = useRef(null);
      
      useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        setContext(ctx);
      }, [context]);
    
    return (

        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>


        <Typography variant="h3" style={{ textAlign: "center"}}>
            Draw the song!
        </Typography>

        <Card elevation={0} style={{ position: 'relative', border: `2px solid ${theme.palette.background.default}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
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

            {/* Drawing Canvas */}
            <canvas
                ref={canvasRef}
                style={{ backgroundColor: theme.palette.background.default, border: `4px solid ${theme.palette.primary.main}`, borderRadius: "8px" }}
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
        
            </CardContent>

        </Card>



        <br></br>
        <br></br>
        <br></br>
        
        </div>
    );
}

export default PictionaryGame;
