import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { red } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../App";
import SignUp from "../signup_components/signup";

function SignIn() {
  const { user, setUser } = useContext(UserContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUser, setValidUser] = useState(true);

  /* Navigation for buttons */
  const navigate = useNavigate();

  const signin_click = (e) => {
    console.log(email + " " + password);
    e.preventDefault();
    //SignIn(email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setValidUser(true);
        setUser(userCredential.user.uid);
        console.log(user);
        //console.log(userCredential.user.uid);
        //console.log(userCredential);

        navigate("/homepage");
        //console.log(u)
      }).catch((error) => {
        setValidUser(false);
        console.log(error);
      });
    console.log("SIGNIN CLICKED");
  };
  const signup_click = () => {
    console.log("SIGNUP CLICKED");
    navigate("/signup");
  };
  const forgot_password_click = () => {
    console.log("FORGOT PASSWORD  CLICKED");
    navigate("/forgot_password");
  };

  return (
    <Container maxWidth="true" disableGutters="true">
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems={"left"}
        style={{ background: 'var(--accent-color)' }}
      >
        {/* Welcome Left Card */}
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
                Welcome to Jukebox!
            </Typography>

            <img src={Logo} alt="Logo" height={75} width={75} />

            <Typography variant="h3"
                style={{
                fontWeight: "normal",
                color: "var(--text-color)",
                fontSize: 20,
                }}
            >
                To get started, sign in to your account or sign up for one today!
            </Typography>
        </Stack>

        {/* Sign In Form */}
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
             <Typography variant="h2" style={{ textAlign: "left", color: 'var(--text-color)'}}>
                Sign In
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

                {/* Email field */}
                <TextField
                  label="Email"
                  InputProps={{ style: { color: 'var(--text-color)' } }} 
                  InputLabelProps={{ style: { color: 'var(--text-color)' } }} 
                  onChange={(event) => setEmail(event.target.value)} // save email from user input
                />

                {/* Password field */}
                <TextField
                  label="Password"
                  InputProps={{ style: { color: 'var(--text-color)' } }} 
                  InputLabelProps={{ style: { color: 'var(--text-color)' } }} 
                  type="password"
                  style= {{ marginBottom: "-25px" }}
                  onChange={(event) => setPassword(event.target.value)} // save password from user input
                />
                <br></br>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {validUser ? <p></p> : (
                    <Typography variant="p" style={{ color: 'red', textAlign: 'left' }}> 
                      Email/password combination does not match 
                    </Typography>
                  )}

                  {/* Forgot password link */}
                  <Typography variant="h4" textAlign="right">
                    <Link
                      variant="contained"
                      style={{
                        color: "#3366ff",
                        fontSize: 15,
                        fontWeight: "bold"
                      }}
                      onClick={forgot_password_click}
                    >
                      Forgot your password?
                    </Link>
                  </Typography>
              </div>

                {/* Sign In button */}
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
                  onClick={signin_click}
                >
                  Sign In
                </Button>
                </Box>

                <br></br>

                {/* Sign Up link */}
                <Typography variant="h4" style = {{ color: 'var(--text-color)' }} >
                  Already have an account? {" "}
                  <Link
                    variant="contained"
                    style={{
                      color: "#3366ff",
                      fontSize: 15,
                      fontWeight: "bold"
                      }}
                    onClick={signup_click}
                  >
                    Sign Up
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

export default SignIn;

