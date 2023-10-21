import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, useContext } from "react";
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
import { auth, db, storage } from "../../utils/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserContext } from "../../App";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";



function EditProfile() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");
    const [image, setImage] = useState("");
    const [imageURL, setImageURL] = useState("");

    /* Navigation for buttons */
    const navigate = useNavigate();
    const settings_click = () => {
        console.log("GO TO SETTINGS");
        navigate("/");
    };

    const submitChanges_click = async () => {
      
      const docRef = doc(db, "users", user);
      await updateDoc(docRef, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
      }).then(() => console.log("Document updated"));
      
      navigate("/profile");
    };

    const editProfilePicture = async () => {
      console.log("Inside editProfilePicture with image: ", image);
      const imageRef = ref(storage, `files/${v4()}`)
      uploadBytes(imageRef, image);
      updateProfilePicture();
      
    };

    const updateProfilePicture = async () => {
      const pathRef = ref(storage, "gs://testing-ca9b2.appspot.com/files/9caf61e2-e7df-4927-9987-ee15944112b3")
      getDownloadURL(pathRef).then(url => {
        setImageURL(data=>[...data,url])
      })

      console.log(imageURL, "imageURL");
    }

    const changePicture = () => {
      console.log("Inside change picture with picture as ", image);
    }


    useEffect(() =>{
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          setUser(user.uid);
          console.log("the profile passed thru uid is: ", user.uid);

          await onSnapshot(doc(db, "users", user.uid), async (doc) => {
            setFirstName(doc.data().firstName);
            setLastName(doc.data().lastName);
            setUsername(doc.data().username);
            setEmail(doc.data().email);
            setSpotifyToken(doc.data().spotifyToken);
            console.log(doc.data());
          });
        } else {
          console.log("auth state where no user");
          navigate("/");
        }
      })
      
    }, []);

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <Typography variant="h2" style={{ textAlign: "left" }}>
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
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={changePicture}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </div>
            <label htmlFor="profile-picture-submit">
                <IconButton
                  color="primary"
                  aria-label="submit picture"
                  component="span"
                  onClick={editProfilePicture}
                >
                  Submit Changes

                </IconButton>
              </label>
              <br></br>
              <img src={image} heigh="200px" width="200px"></img>
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