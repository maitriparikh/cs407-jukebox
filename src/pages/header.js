import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FullLogo from "../full_logo.png";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
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

function Header() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  return (
    <Box>
      <AppBar position="static" sx={{ background: "var(--accent-color)" }}>
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
                <MenuIcon sx={{ color: "var(--text-color)" }} size="large" />

            </IconButton>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    width: 240,
                    flexShrink: 0,
                    color: "primary.contrastText",
                    backgroundColor: "sidebarColor.main",
                    fontFamily: "Rubik",
                    "& .MuiDrawer-paper": {
                      width: 240,
                      boxSizing: "border-box",
                    },
                  },
                }}
            >
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
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Homepage"} style={{color:"var(--text-color)"}}/>
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
                                <LeaderboardIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Leaderboard"} style={{color:"var(--text-color)"}}/>
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
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Profile"} style={{color:"var(--text-color)"}}/>
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
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Settings"} style={{color:"var(--text-color)"}}/>
                        </ListItemButton>
                    </ListItem>

                </List>

            </Drawer>

            {/* Logo */}
            <img
            //src={WhiteLogo}
            src={FullLogo}
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
