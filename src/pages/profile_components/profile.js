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
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LogoutIcon from "@mui/icons-material/Logout";

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

    const signOut_click = () => {
      console.log("SIGNED OUT");
      navigate("/");
    }

    const editProfile_click = () => {
      console.log("GO TO EDIT PROFILE");
      navigate("/editprofile");
    }

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h1" style={{ textAlign: "left" }}>
            My Profile
        </Typography>

        <br></br>

        <Grid container spacing={4}>

          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "250px", width: "100%" }}>
              <CardContent>
              <div>
              <Avatar
                src={Logo}
                sx={{
                  width: 150,
                  height: 150,
                  border: "3px solid var(--text-color)",
                  borderRadius: "50%", 
                  margin: "auto", 
                }}
              >
              </Avatar>

            </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={5}>
          <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `3px solid var(--text-color)`, borderRadius: "8px", height: "200px", width: "100%" }}>
            <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {firstName} {lastName}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {username}
              </Typography>
              <Typography variant="h3" style={{ margin: "3%" }} component="div">
                {email} 
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={3}>
            <Card elevation={0} style={{ height: "200px", width: "100%" }}>
              <CardContent>
              <Stack spacing={2} direction="column" alignItems="center">
                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                  >
                    Connect to Spotify
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                  >
                    Update Music Preferences
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: 230,
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--accent-color)',
                      textTransform: "none",
                      fontSize: 15,
                      fontWeight: "bold",
                      margin: "3%"
                    }}
                    onClick={editProfile_click}
                  >
                    Edit Profile
                  </Button>
                  
                </Stack>

              </CardContent>
            </Card>
          </Grid>
  
        </Grid>


        <Grid item xs={3}>

        <Button
            variant="contained"
            style={{
              width: 230,
              color: "#DE6600",
              backgroundColor: 'var(--accent-color)',
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold",
              margin: "1%"
            }}
            onClick={signOut_click}
          >
            <LogoutIcon sx={{ color: "#DE6600" }} /> &nbsp; Sign Out
          </Button>
  
        </Grid>

        </div>
      );
    }

export default Profile;