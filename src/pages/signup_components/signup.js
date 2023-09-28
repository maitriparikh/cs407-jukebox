import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "@mui/material";
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import validPassword from "../../utils/require";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../App";



function SignUp() {
  const { user, setUser } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  //const [validPassword, setValidPassword] = useState("");
  //const [validUsername]

  /* Navigation for buttons */
  const navigate = useNavigate();

  const signup_click = async (e) => {
    console.log(email + " " + password);
    e.preventDefault();
    if (handleInput()) {
      
      console.log("validPassword");

    } else {
      console.log("bad password");
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        //console.log(userCredential);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          securityQuestion: securityQuestion
        });
        setUser(userCredential.user.uid);

      }).catch((error) => {
        console.log(error);
      });
    
    console.log("SIGNUP CLICKED");
    signin_click();
  };
  
  const signin_click = () => {
    console.log("GO BACK TO SIGNIN CLICKED");
    navigate("/");
  };

  const handleInput = () => {
    const result = true;
    //
    return (password.length >= 6  && result); 
  }

  return (
    <Container maxWidth="true" disableGutters="true">
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems={"left"}
        style={{ background: 'var(--accent-color)' }}
      >
        {/* Left Card */}
        <Stack
            sx={{
                height: "90vh",
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "50px",
                borderRight: '4px solid var(--line-color)'
            }}
            spacing={4}
            >
            <Typography variant="h1"
                style={{
                fontWeight: "bold",
                color: "var(--text-color)",
                fontSize: 55,
                }}
            >
               Sign Up for Jukebox!
            </Typography>

            <img src={Logo} alt="Logo" height={75} width={75} />

            <Typography variant="h3"
                style={{
                fontWeight: "normal",
                color: "var(--text-color)",
                fontSize: 20,
                }}
            >
                Fill in the fields to set up your account and start playing today!
            </Typography>
        </Stack>

        {/* Form Fields */}
        <Box
          p={4}
          sx={{
            backgroundColor: "#ffffff",
            minHeight: "100%",
            display: "flex",
            width: "100%",
            alignItems:"center"
          }}
        >
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="center"
          >

            <Stack marginX="22%" width="80%">
            <div style={{ marginBottom: '20px' }}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
                Create Your Account
              </Typography>   
            </div>        

              {/* Form Stack */}
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                width="70%"
              >

              <Typography variant="h4" style={{ textAlign: "left" }}>
                Account Information
              </Typography>
              
                {/* First Name field */}
                <TextField
                  label="First Name"
                  onChange={(event) => setFirstName(event.target.value)} // save password from user input
                />

                {/* Last Name field */}
                <TextField
                  label="Last Name"
                  onChange={(event) => setLastName(event.target.value)} // save password from user input
                />

                {/* Username field */}
                <TextField
                  label="Username"
                  onChange={(event) => setUsername(event.target.value)} // save username from user input
                />

                {/* Email field */}
                <TextField
                  label="Email"
                  onChange={(event) => setEmail(event.target.value)} // save email from user input
                />

                {/* Password field */}
                <TextField
                  label="Password"
                  type="password"
                  validation={{
                    required: {
                      value: true,
                      message: 'required',
                    },
                    minLength: {
                      value: 6,
                      message: 'min 6 characters',
                    },
                  }}
                  onChange={(event) => setPassword(event.target.value)} // save password from user input
                />

              <Typography variant="h4" style={{ textAlign: "left" }}>
                Security Question
              </Typography>

                {/* Security Question */}
                <FormControl>
                  <InputLabel id="demo-simple-select-label" label="label">
                    What is a city you would like to visit?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="What is a city you would like to visit?"
                    defaultValue={10} // Set the default option by its value
                    onClick={(event) => setSecurityQuestion(event.target.innerText)}
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

                <br></br>

                {/* Sign Up button */}
                <Box textAlign='center'>
                <Button
                  variant="contained"
                  style={{
                    width: 200,
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--accent-color)',
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: "bold"
                    }}
                  onClick={signup_click}
                >
                  Sign Up
                </Button>
                </Box>

                <br></br>

                {/* Sign In link */}
                <Typography variant="h4" >
                  Already have an account? {" "}
                  <Link
                    variant="contained"
                    style={{
                      color: "#3366ff",
                      fontSize: 16,
                      fontWeight: "bold"
                      }}
                    onClick={signin_click}
                  >
                    Sign In
                  </Link>
                  </Typography>

              </Stack>
            </Stack>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}

export default SignUp;

