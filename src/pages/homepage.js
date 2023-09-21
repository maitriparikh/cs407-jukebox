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
        <div style={{ margin: "10%" }}>
        <Grid container spacing={2}>

          {/* First Row */}
          <Grid item xs={4}>
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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
            <Card elevation={3} style={{ borderRadius: "8px", height: "200px", width: "400px" }}>
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