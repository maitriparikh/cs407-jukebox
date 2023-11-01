import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FullLogoLight from "../jukebox_logo_light.png";
import FullLogoDark from "../jukebox_logo_dark.png";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { signOut } from "firebase/auth"; 
import { db, auth } from "../utils/firebase";
import { UserContext } from "../App";

import { useTheme } from '@mui/material/styles';



function Header() {

  const theme = useTheme();

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  const userSignOut = () => {
    signOut(auth).then(() => {
        console.log("sign out successful");
        setUser(null);
        navigate("/");
    }).catch(error => console.log(error))
  };

  const signOut_click = () => {
    userSignOut();
    console.log("SIGNED OUT");
    navigate("/");
  }

  return (
    <Box>
      <AppBar position="static" sx={{ background: `${theme.palette.secondary.main}`, borderBottom: "4px solid var(--line-color)", boxShadow: "none" }}>
        <Toolbar>
            {/* Hamburger Menu */}
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={() => setDrawerOpen(true)}
            >
               <MenuIcon sx={{ color: `${theme.palette.primary.main}` }} size="large" />

            </IconButton>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
              <div style={{ backgroundColor: theme.palette.background.default, height: '100vh', paddingTop: '15px', paddingLeft: '30px', paddingRight: '80px' }}>
                <List>
                  <ListItem disablePadding id="text">
                    <img
                    src={FullLogoLight}
                    alt="Logo"
                    style={{ paddingLeft: '10px', height: 60 }}
                    onClick={() => {
                        navigate("/homepage");
                    }}
                    />
                  </ListItem>
                </List>

                  <List>

                      {/* Homepage */}
                      <ListItem disablePadding id="text">
                          <ListItemButton
                              onClick={() => {
                                  navigate("/homepage");
                                  setDrawerOpen(false);
                              }}
                          >
                              <ListItemIcon>
                                  {" "}
                                  <HomeIcon sx={{ color: `${theme.palette.primary.main}`, opacity: 0.7 }}/>
                              </ListItemIcon>
                              <ListItemText primary={"Homepage"} style={{color:`${theme.palette.primary.main}`}}/>
                          </ListItemButton>
                      </ListItem>

                      {/* Leaderboard */}
                      <ListItem disablePadding id="text">
                          <ListItemButton
                              onClick={() => {
                                  navigate("/leaderboard");
                                  setDrawerOpen(false);
                              }}
                          >
                              <ListItemIcon>
                                  {" "}
                                  <LeaderboardIcon sx={{ color: `${theme.palette.primary.main}`, opacity: 0.7 }}/>
                              </ListItemIcon>
                              <ListItemText primary={"Leaderboard"} style={{color:`${theme.palette.primary.main}`}}/>
                          </ListItemButton>
                      </ListItem>

                      {/* Profile */}
                      <ListItem disablePadding id="text">
                          <ListItemButton
                              onClick={() => {
                                  navigate("/profile");
                                  setDrawerOpen(false);
                              }}
                          >
                              <ListItemIcon>
                                  {" "}
                                  <AccountCircleIcon sx={{ color: `${theme.palette.primary.main}`, opacity: 0.7 }}/>
                              </ListItemIcon>
                              <ListItemText primary={"Profile"} style={{color:`${theme.palette.primary.main}`}}/>
                          </ListItemButton>
                      </ListItem>

                      {/* Settings */}
                      <ListItem disablePadding id="text">
                          <ListItemButton
                              onClick={() => {
                                  navigate("/settings");
                                  setDrawerOpen(false);
                              }}
                          >
                              <ListItemIcon>
                                  {" "}
                                  <SettingsIcon sx={{ color: `${theme.palette.primary.main}`, opacity: 0.7 }}/>
                              </ListItemIcon>
                              <ListItemText primary={"Settings"} style={{color:`${theme.palette.primary.main}`}}/>
                          </ListItemButton>
                      </ListItem>

                  </List>

                  {/* Log out button*/}
                  <List
                    sx={{
                      width: "100%",
                      bottom: 0,
                      position: "absolute",
                      paddingLeft: "5px"
                    }}
                  >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemIcon>
                        {" "}
                        <LogoutIcon sx={{ color: "#DE6600" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Box fontWeight="500">Sign Out</Box>}
                        sx={{ color: "#DE6600", fontWeight: "bold" }}
                        onClick={signOut_click}
                      />
                    </ListItemButton>
                  </ListItem>
              </List>
            </div>

            </Drawer>

            {/* Logo */}
            <img
            //src={WhiteLogo}
            src={FullLogoLight}
            alt="Logo"
            height={70}
            onClick={() => {
                navigate("/homepage");
            }}
            />


            {/* Profile Picture */}
            <Avatar
                src={AccountCircleIcon}
                sx={{ marginLeft: "auto" }}
                onClick={() => {
                navigate("/profile");
                }}
            />
        </Toolbar>
      </AppBar>
    </Box>
    //</ThemeProvider>
  );
}
export default Header;
