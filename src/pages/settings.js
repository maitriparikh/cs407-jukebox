import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


function Settings() {
    const [firstName] = useState("Purdue");
    const [lastName] = useState("Pete");
    const [username] = useState("purdue_pete");
    const [email] = useState("pete@purdue.edu");

    const [darkMode, setDarkMode] = useState(true);
    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const [filteredMode, setFilteredMode] = useState(true);
    const handleFilteredModeToggle = () => {
        setFilteredMode(!filteredMode);
    };

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 124, // Double the width
        height: 68, // Double the height
        padding: 14, // Double the padding
        '& .MuiSwitch-switchBase': {
          margin: 2, // Double the margin
          padding: 0,
          transform: 'translateX(12px)',
          '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(44px)',
            '& .MuiSwitch-thumb:before': {
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
              )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
          },
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
          width: 64, // Double the width
          height: 64, // Double the height
          '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
          },
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
          borderRadius: 68 / 2, // Double the borderRadius
        },
      }));
      

    /* Navigation for buttons */
    const navigate = useNavigate();
    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h1" style={{ textAlign: "left" }}>
            Settings
        </Typography>

        <br></br>

        <Grid container spacing={5}>

        
          <Grid item xs={6}>

            {/* Light/Dark Mode */}
            <Card 
              style={{ 
                height: "250px", 
                width: "100%",
                border: `3px solid var(--text-color)`, 
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 20,
                fontWeight: "bold"
                }}
            >
              <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="h2" component="div">
                    Appearance
                </Typography>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", marginTop:"-5%"}}>
                {/* Toggle Switch */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3" > Light 🌝</Typography>
                    <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    />
                    <Typography variant="h3" > Dark 🌚</Typography>
                </Stack>
                </div>

              </CardContent>
            </Card>

            {/* Content Filter */}
            <Card 
              style={{ 
                marginTop: "20px",
                height: "250px", 
                width: "100%",
                border: `3px solid var(--text-color)`, 
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="h2" component="div">
                    Content Filter
                </Typography>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", marginTop:"-5%"}}>
                {/* Toggle Switch */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3" > Explicit 🤬</Typography>
                    <Switch
                    checked={filteredMode}
                    onChange={handleFilteredModeToggle}
                    />
                    <Typography variant="h3" > Filtered 🤗</Typography>
                </Stack>
                </div>

              </CardContent>
            </Card>
          </Grid>

          {/* Change Password */}
          <Grid item xs={6}>
            <Card 
              style={{ 
                height: "526px", 
                width: "100%",
                border: `3px solid var(--text-color)`, 
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
                <br></br>
              <Typography variant="h2" component="div">
                Change Password
              </Typography>
              <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}> 
              {/* Form Stack */}
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                width="70%"
                marginTop="-15%"
              >
                {/* Email Field */}
                <TextField
                  label="Email"
                />

                {/* Old Password Field */}
                <TextField
                  label="Old Password"
                />

                {/* New Password Field */}
                <TextField
                  label="New Password"
                />

                {/* Confirm New Password Field */}
                <TextField
                  label="Confirm New Password"
                />
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
                >
                  Submit
                </Button>   

              </Stack>


              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TAKE OUT LATER -- TESTING PURPOSES */}
        {darkMode ? (
            <Typography variant="h4" component="div">
                dark mode on
            </Typography>
        ) : (
            <Typography variant="h4" component="div">
                dark mode off
            </Typography>
        )}
        {/* TAKE OUT LATER -- TESTING PURPOSES */}
        {filteredMode ? (
            <Typography variant="h4" component="div">
                filtered mode on
            </Typography>
        ) : (
            <Typography variant="h4" component="div">
                filtered mode off
            </Typography>
        )}
        
        </div>
      );
    }

export default Settings;