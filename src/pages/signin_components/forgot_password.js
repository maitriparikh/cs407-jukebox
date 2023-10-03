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
        
        
function ForgotPassword() {

    /* Navigation for buttons */
    const navigate = useNavigate();

    
    const signup_click = () => {
        console.log("PASSWORD RESET SUBMITTED");
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
            height: "500px", 
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

                    {/* Email Field */}
                    <TextField
                        label="Email"
                    />

                    {/* New Password Field */}
                    <TextField
                        label="New Password"
                    />

                    {/* Confirm New Password Field */}
                    <TextField
                        label="Confirm New Password"
                    />

                    {/* Security Question Verification */}
                    <Typography variant="h4" style={{ textAlign: "left" }}>
                        Security Question Verification
                    </Typography>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label" label="label">
                        What is a city you would like to visit?
                        </InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="What is a city you would like to visit?"
                        defaultValue={10} // Set the default option by its value
                        >
                        <MenuItem value={10}>New York City</MenuItem>
                        <MenuItem value={20}>San Francisco</MenuItem>
                        <MenuItem value={30}>Paris</MenuItem>
                        <MenuItem value={40}>Barcelona</MenuItem>
                        <MenuItem value={50}>New Delhi</MenuItem>
                        <MenuItem value={60}>Venice</MenuItem>
                        <MenuItem value={60}>Shanghai</MenuItem>
                        <MenuItem value={70}>Tokyo</MenuItem>
                        <MenuItem value={80}>Seoul</MenuItem>
                        <MenuItem value={90}>London</MenuItem>
                        <MenuItem value={100}>Nairobi</MenuItem>
                        </Select>
                    </FormControl>
                
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
            onClick={signup_click}
        >
            Submit
        </Button>  


    </div>
    );
}

export default ForgotPassword;

