import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Logo from '../../logo.png';
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Navigation for buttons */
  const navigate = useNavigate();
  const signin_click = () => {
    console.log("SIGNIN CLICKED");
  };
  const signup_click = () => {
    console.log("SIGNUP CLICKED");
    navigate("/signup");
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
                borderRight: 'var(--line-color)'
            }}
            spacing={4}
            >
            <h5
                style={{
                fontWeight: "bold",
                color: "var(--text-color)",
                fontSize: 55,
                }}
            >
                Welcome to Jukebox!
            </h5>

            <img src={Logo} alt="Logo" height={75} width={75} />

            <h4
                style={{
                fontWeight: "normal",
                color: "var(--text-color)",
                fontSize: 20,
                }}
            >
                To get started, sign in to your account or sign up for one today!
            </h4>
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

            <Stack marginX="15%" width="100%">
              <h1 style={{ textAlign: "left", color: 'var(--text-color)'}}>
                Sign In
              </h1>

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
                  onChange={(event) => setEmail(event.target.value)} // save email from user input
                />

                {/* Password field */}
                <TextField
                  label="Password"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)} // save password from user input
                />

                <br></br>


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
                <h4 style={{ color: 'var(--text-color)', marginBottom: "0", fontSize: 16 }}>
                  Don't have an account? {" "}
                  <Link
                    variant="contained"
                    style={{
                      color: "#3366ff",
                      fontSize: 16,
                      fontWeight: "bold"
                      }}
                    onClick={signup_click}
                  >
                    Sign Up
                  </Link>
                </h4>

              </Stack>
            </Stack>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}

export default SignIn;

