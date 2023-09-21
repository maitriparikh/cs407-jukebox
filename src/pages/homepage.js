import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import { useNavigate } from "react-router-dom";

function Homepage() {

    return (
      <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "7%", marginRight: "7%" }}>

        <h1 style={{ textAlign: "center", color: "var(--text-color)", fontSize: "50px" }}>
            Homepage
        </h1>

        <Button
          variant="contained"
          style={{
            width: "15%",
            marginBottom: "20px",
            color: "var(--text-color)",
            border: `2px solid var(--text-color)`,
            backgroundColor: "var(--accent-color)",
            textTransform: "none",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Random 🔀
        </Button>
        <br></br>
        <br></br>

        <Grid container spacing={5}>

          {/* First Row */}
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Daily Challenge
                </Typography>
                <Typography variant="body2">
                  Content for Card 1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Song Roulette
                </Typography>
                <Typography variant="body2">
                  Content for Card 2
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Pictionary
                </Typography>
                <Typography variant="body2">
                  Content for Card 3
                </Typography>
              </CardContent>
            </Card>
          </Grid>
    
          {/* Second Row */}
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Song Snippet
                </Typography>
                <Typography variant="body2">
                  Content for Card 4
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Trivia Challenge
                </Typography>
                <Typography variant="body2">
                  Content for Card 5
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3} style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)", border: `2px solid var(--text-color)`, borderRadius: "8px", height: "250px", width: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Lyric Challenge
                </Typography>
                <Typography variant="body2">
                  Content for Card 6
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </div>
      );
    }
    

export default Homepage;