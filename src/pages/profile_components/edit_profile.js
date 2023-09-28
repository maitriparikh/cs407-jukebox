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
import { db } from "../../utils/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";


function EditProfile() {
    const [firstName, setFirstName] = useState("Francisco");
    const [lastName, setLastName] = useState("Chagua");
    const [username, setUsername] = useState("fchagua");
    const [email, setEmail] = useState("fchagua@purdue.edu");

    /* Navigation for buttons */
    const navigate = useNavigate();
    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    const updateUser = async () => {
      const userRef = query(collection(db, "users"), where("username", "==", username));
      const findUsers = await getDocs(userRef);
      findUsers.forEach( async (user) => {
        const getUser = doc(db, 'users', user.username);
        await updateDoc(getUser, {
          firstname: firstName,
          lastname: lastName,
          username: username,
          email: email
        });
      });
    };
  

    const submitChanges_click = async () => {
      //updateDoc();
      //need to find a way to skip having to use the documentId (which is hard to find)
      /*
      const userRef = query(collection(db, "users"), where("username", "==", 'fchagua'));
      const docRef = await updateDoc(getDoc(userRef), {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
      });
      */
      console.log("SIGNED OUT");
      navigate("/profile");
    }

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h1" style={{ textAlign: "left" }}>
            Edit Profile
        </Typography>

        <br></br>

        <Grid container spacing={4}>

          <Grid item xs={5}>
            <Card elevation={0} style={{ height: "400px", width: "100%" }}>
              <CardContent>
              <div>
              <Avatar
                src={Logo}
                sx={{
                  width: 270,
                  height: 270,
                  border: "3px solid var(--text-color)",
                  borderRadius: "50%", 
                  margin: "auto", 
                }}
              >
              </Avatar>

              {/* Upload button */}
              <input
                type="file"
                accept="image/*"
                id="profile-picture-upload"
                style={{ display: "none" }}
                /* Handle profile image change in later sprint */
                // onChange={uploadImage}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </div>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={7}>
          <Card elevation={0} style={{ height: "400px", width: "100%" }}>
            <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                width="70%"
              >
              
                {/* First Name field */}
                <TextField
                label="First Name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)} 
                InputLabelProps={{
                    shrink: true,
                }}
                />

                {/* Last Name field */}
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                }}
                />

                {/* Username field */}
                <TextField
                  label="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)} 
                  InputLabelProps={{
                    shrink: true,
                }}
                />

                {/* Email field */}
                <TextField
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)} 
                  InputLabelProps={{
                    shrink: true,
                }}
                />

                <br></br>

                <Button
                variant="contained"
                style={{
                    width: 230,
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--accent-color)',
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: "auto"
                }}
                onClick={submitChanges_click}
                >
                Submit Profile Changes
                </Button>

              </Stack>

            </CardContent>
          </Card>
          </Grid>         
        </Grid>

        </div>
      );
    }

export default EditProfile;