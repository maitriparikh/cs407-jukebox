import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { auth, db } from "../../utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
        
function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");

    /* Navigation for buttons */
    const navigate = useNavigate();

    
    const forgot_password = () => {
        console.log("PASSWORD RESET SUBMITTED");
        
        sendPasswordResetEmail(auth, email).then(() => {
            console.log("Password reset email sent");
        }).catch((error) => {
            console.log(error)
        });
        navigate("/");
    };

    return (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h2" style={{ textAlign: "center" }}>
            Reset Your Password
        </Typography>

        <br></br>

        <Card 
            style={{ 
            height: "300px", 
            border: `3px solid var(--text-color)`, 
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            width: "70%", 
            margin: "0 auto", 
            }}
        >
            <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}> 
            
                {/* Form Stack */}
                <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={4}
                width="70%"
                marginTop="-5%"
                >
                    <p>Please enter the email where we can send you a password reset</p>
                    {/* Email Field */}
                    <TextField
                        label="Email"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    
                
                </Stack>

            </CardContent> 

        </Card>

        <br></br>

        <Button
            variant="contained"
            style={{
            width: 200,
            color: 'var(--text-color)',
            backgroundColor: 'var(--accent-color)',
            textTransform: "none",
            fontSize: 15,
            fontWeight: "bold",
            alignSelf: "center"
            }}
            onClick={forgot_password}
        >
            Submit
        </Button>  


    </div>
    );
}

export default ForgotPassword;

