import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import AuthDetails from "./utils/authDetails";
import socketClient  from "socket.io-client";

import Header from "./pages/header";
import SignIn from "./pages/signin_components/signin";
import ForgotPassword from "./pages/signin_components/forgot_password";
import SignUp from "./pages/signup_components/signup";
import Profile from "./pages/profile_components/profile";
import Homepage from "./pages/homepage";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings";
import EditProfile from "./pages/profile_components/edit_profile";
import MusicPreferencesQuiz from "./pages/profile_components/music_preference_quiz";
import CustomPlaylist from "./pages/profile_components/custom_playlist";
import FullLogoLight from "../src/jukebox_logo_light.png";
import FullLogoDark from "../src/jukebox_logo_dark.png";


// Daily Challenge Game Pages
import DailyChallengeLobby from "./pages/daily_challenge/daily_challenge_lobby";
import DailyChallengeGame from "./pages/daily_challenge/daily_challenge_game";

// Song Roulette Game Pages
import SongRouletteLobby from "./pages/song_roulette/song_roulette_lobby";
import SongRouletteGame from "./pages/song_roulette/song_roulette_game";
import SongRouletteLobbyBrowser from "./pages/song_roulette/song_roulette_browser";

import LobbyViewer from "./pages/song_roulette/song_roulette_lobby_viewer";

// Doodle Challenge Game Pages
import DoodleChallengeLobby from "./pages/doodle_challenge/doodle_challenge_lobby";
import DoodleChallengeGame from "./pages/doodle_challenge/doodle_challenge_game";

// Timeline Challenge Game Pages
import TimelineChallengeLobby from "./pages/timeline_challenge/timeline_challenge_lobby";
import TimelineChallengeGame from "./pages/timeline_challenge/timeline_challenge_game";

// Song Snippet Game Pages
import SongSnippetLobby from "./pages/song_snippet/song_snippet_lobby";
import SongSnippetGame from "./pages/song_snippet/song_snippet_game";

// Trivia Challenge Game Pages
import TriviaChallengeLobby from "./pages/trivia_challenge/trivia_challenge_lobby";
import TriviaChallengeGame from './pages/trivia_challenge/trivia_challenge_game';

// Lyric Challenge Game Pages
import LyricChallengeLobby from "./pages/lyric_challenge/lyric_challenge_lobby";

// Memory Challenge Game Pages
import MemoryChallengeLobby from "./pages/memory_challenge/memory_challenge_lobby";
import MemoryChallengeGame from "./pages/memory_challenge/memory_challenge_game";

import { useState, createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from './utils/firebase';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";


import Box from '@mui/material/Box';

import { ThemeProvider } from "@mui/material/styles";
import JukeboxTheme from "./theme"; 

export const UserContext = createContext(null);


function App() {
  // for light/dark mode (default = light mode)
  const [appearance, setAppearance] = useState("light");

  // for explicit/filtered mode (default = explicit mode)
  const [contentFilter, setContentFilter] = useState("explicit");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("auth state changed");
        console.log("the passed thru user is: ", user);
        setCurrentUser(user);
        setUser(user.uid);

        const userDocRef = doc(db, "users", user.uid);

        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          const userData = doc.data();

          if (userData) {
            // check if appearance is defined in Firebase
            if (userData.appearance) {
              setAppearance(userData.appearance);
              console.log('APPEARANCE FROM FIREBASE: ' + userData.appearance);
            } else {
              console.log('APPEARANCE NOT FOUND IN FIREBASE!');
            }
            // check if contentFilter is defined in Firebase
            if (userData.contentFilter) {
              setContentFilter(userData.contentFilter);
              console.log('CONTENT FILTER FROM FIREBASE: ' + userData.contentFilter);
            } else {
              console.log('CONTENT FILTER NOT FOUND IN FIREBASE!');
            }
          }
        });

      } else {
        console.log("auth state where no user");
        navigate("/");
      }
    })
  }, []);

  const location = useLocation();
  const conditionalHeader =
    location.pathname === "/" ||
    location.pathname === "/signup" ? null : ( 
      <Header logo={appearance === "light" ? FullLogoLight : FullLogoDark} />
    );
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
    
  console.log("user is :" + user);
      return (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            minHeight: '100vh',
          }}
        >
            <div className="App">
              <UserContext.Provider value={{ user: user, setUser: setUser }}>
              <ThemeProvider theme={JukeboxTheme(appearance)}>
                    <Box
                    sx={{
                      backgroundColor: (theme) => theme.palette.background.default,
                      minHeight: '100vh',
                    }}
                  >
                {conditionalHeader}
                
                

                    <AuthDetails></AuthDetails>
                    <Routes>
                      <Route path="/" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/homepage" element={<Homepage />} /> 
                      <Route path="/profile" element={<Profile />} />
                    
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      
                        <Route path="/settings" element={<Settings appearanceSelection={appearance} contentFilterSelection={contentFilter} />} />

                        
                        <Route path="/editprofile" element={<EditProfile />} /> 
                        
                        <Route path="/customPlaylist" element={<CustomPlaylist />} /> 

                        <Route path="/musicpreferencesquiz" element={<MusicPreferencesQuiz />} />
                        
                        <Route path="/dailychallengelobby" element={<DailyChallengeLobby />} />
                        <Route path="/dailychallengegame" element={<DailyChallengeGame />} />
                        <Route path="/SongRoulettelobbybrowser" element={<SongRouletteLobbyBrowser />} />
                        <Route path="/songroulettelobby" element={<SongRouletteLobby />} />
                        <Route path="/songroulettegame" element={<SongRouletteGame />} />

                        <Route path="/doodlechallengelobby" element={<DoodleChallengeLobby />} />
                        <Route path="/doodlechallengegame" element={<DoodleChallengeGame />} />

                        <Route path="/timelinechallengelobby" element={<TimelineChallengeLobby />} />
                        <Route path="/timelinechallengegame" element={<TimelineChallengeGame />} />

                        <Route path="/songsnippetlobby" element={<SongSnippetLobby />} />
                        <Route path="/songsnippetgame" element={<SongSnippetGame />} />

                        <Route path="/triviachallengelobby" element={<TriviaChallengeLobby />} />
                        <Route path="/triviachallengegame" element={<TriviaChallengeGame />} />

                        <Route path="/lyricchallengelobby" element={<LyricChallengeLobby />} />

                        <Route path="/memorychallengelobby" element={<MemoryChallengeLobby />} />
                        <Route path="/memorychallengegame" element={<MemoryChallengeGame />} />

                        <Route path="/forgot_password" element={<ForgotPassword />} />
                    </Routes>
                    </Box>
                    </ThemeProvider >
                  </UserContext.Provider>       
                </div>
              </Box>
            );
  

}

export default App;
