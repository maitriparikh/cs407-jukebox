import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "@mui/material";

function Profile() {
    const [firstName] = useState("Purdue");
    const [lastName] = useState("Pete");
    const [username] = useState("purdue_pete");
    const [email] = useState("pete@purdue.edu");

    /* Navigation for buttons */
    const navigate = useNavigate();
    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    return (
        <Box sx={{ margin: "5%" }}>
        <Container maxWidth="true" disableGutters="true">

          <h1 style={{ textAlign: "left", color: "var(--text-color)" }}>
            My Profile
          </h1>

          <br></br>
          <Grid container
                direction={"row"}
                spacing={2}
                rowSpacing={2}
                columnSpacing={3}
                sx={{ marginLeft: "1%", alignItems: "center" }}
            >

            {/* First Column */}
            <Stack
            sx={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            >
            <img
                src={Logo}
                alt="Profile Picture"
                style={{
                border: "2px solid var(--text-color)",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                }}
            />
            </Stack>
    
            {/* Second Column */}
            <Stack
            p={2}
            sx={{
                backgroundColor: "var(--accent-color)",
                color: "var(--text-color)",
                border: `2px solid var(--text-color)`,
                borderRadius: "10px",
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
            >
            <h2>
                {firstName} {lastName}
            </h2>
            <h2>
                @{username}
            </h2>
            <h2>{email}</h2>
            </Stack>
    
            {/* Third Column */}
              <Stack
                p={2}
                sx={{
                  backgroundColor: "#ffffff",
                  minHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "70%",
                    color: "var(--text-color)",
                    border: `2px solid var(--text-color)`,
                    backgroundColor: "var(--accent-color)",
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  My Spotify Data
                </Button>
    
                <Button
                  variant="contained"
                  style={{
                    width: "70%",
                    color: "var(--text-color)",
                    border: `2px solid var(--text-color)`,
                    backgroundColor: "var(--accent-color)",
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  Update Music Preferences
                </Button>
              </Stack>
          </Grid>
        </Container>
        </Box>
      );
}

export default Profile;