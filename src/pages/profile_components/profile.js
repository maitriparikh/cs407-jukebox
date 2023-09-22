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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography";

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
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h2" style={{ textAlign: "left" }}>
            My Profile
        </Typography>

        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "200px", width: "100%" }}>
              <CardContent>
                <Typography variant="h3" component="div">
                  Profile Picture
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "200px", width: "100%" }}>
              <CardContent>
                <Typography variant="h3" style={{ margin: "5%" }} component="div">
                  {firstName} {lastName}
                </Typography>
                <Typography variant="h3" style={{ margin: "5%" }} component="div">
                  {username}
                </Typography>
                <Typography variant="h3" style={{ margin: "5%" }} component="div">
                  {email} 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={0} style={{ height: "200px", width: "100%" }}>
              <CardContent>
              <Stack spacing={2} direction="column" alignItems="center">
                  <Button
                    variant="contained"
                    style={{
                      width: 300,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "2%"
                    }}
                  >
                    My Spotify Data
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 300,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "2%"
                    }}
                  >
                    Update Music Preferences
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 300,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "2%"
                    }}
                  >
                    Edit Profile
                  </Button>
                </Stack>

              </CardContent>
            </Card>
          </Grid>
  
        </Grid>
        </div>
      );
    }

export default Profile;