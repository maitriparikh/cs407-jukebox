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


// Daily Challenge Game Pages
import DailyChallengeLobby from "./pages/daily_challenge/daily_challenge_lobby";

// Song Roulette Game Pages
import SongRouletteLobby from "./pages/song_roulette/song_roulette_lobby";
import SongRouletteGame from "./pages/song_roulette/song_roulette_game";
import SongRouletteLobbyBrowser from "./pages/song_roulette/song_roulette_browser";

import LobbyViewer from "./pages/song_roulette/song_roulette_lobby_viewer";

// Pictionary Game Pages
import PictionaryLobby from "./pages/pictionary/pictionary_challenge_lobby";

// Song Snippet Game Pages
import SongSnippetLobby from "./pages/song_snippet/song_snippet_lobby";

// Trivia Challenge Game Pages
import TriviaChallengeLobby from "./pages/trivia_challenge/trivia_challenge_lobby";
import TriviaChallengeGame from './pages/trivia_challenge/trivia_challenge_game';

// Lyric Challenge Game Pages
import LyricChallengeLobby from "./pages/lyric_challenge/lyric_challenge_lobby";

import { useState, createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from './utils/firebase';

import Box from '@mui/material/Box';

export const UserContext = createContext(null);

function App() {
  const location = useLocation();
  const conditionalHeader =
    location.pathname === "/" ||
    location.pathname === "/signup" ? null : (
      <Header></Header>
    );
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  

  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("auth state changed");
        console.log("the passed thru user is: ", user);
        setCurrentUser(user);
        setUser(user.uid);
      } else {
        console.log("auth state where no user");
        navigate("/");
      }
    })
  }, []);
  
  

  
  if (true) {
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
                {conditionalHeader}

                    <AuthDetails></AuthDetails>
                    <Routes>
                      <Route path="/" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/homepage" element={<Homepage />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/editprofile" element={<EditProfile />} />
                      <Route path="/musicpreferencesquiz" element={<MusicPreferencesQuiz />} />
                      <Route path="/dailychallengelobby" element={<DailyChallengeLobby />} />
                      <Route path="/SongRoulettelobbybrowser" element={<SongRouletteLobbyBrowser />} />
                      <Route path="/songroulettelobby" element={<SongRouletteLobby />} />
                      <Route path="/songroulettegame" element={<SongRouletteGame />} />
                      <Route path="/pictionarylobby" element={<PictionaryLobby />} />
                      <Route path="/songsnippetlobby" element={<SongSnippetLobby />} />
                      <Route path="/triviachallengelobby" element={<TriviaChallengeLobby />} />
                      <Route path="/triviachallengegame" element={<TriviaChallengeGame />} />
                      <Route path="/lyricchallengelobby" element={<LyricChallengeLobby />} />
                      <Route path="/forgot_password" element={<ForgotPassword />} />
                    </Routes>
                  </UserContext.Provider>       
                </div>
              </Box>
            );
  }
  
  else {
    console.log("no user logged in");
    
    // If var "user" is null then dont allow them to access any routes(pages)
    // besides login and signup
    //  <Route path="*" element={<Navigate replace to="/" />} />
    // path="*" - means all other pahts
    // to="/" - redirect to "/" which is the signin page
    
      return (
    <div className="App">
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        {conditionalHeader}

        
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
         <Route path="*" element={<Navigate replace to="/" />} />

        </Routes>
      </UserContext.Provider>       
    </div>
  );
  }


}

export default App;
