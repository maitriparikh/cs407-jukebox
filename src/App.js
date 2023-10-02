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

import Header from "./pages/header";
import SignIn from "./pages/signin_components/signin";
import SignUp from "./pages/signup_components/signup";
import Profile from "./pages/profile_components/profile";
import Homepage from "./pages/homepage";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings";
import EditProfile from "./pages/profile_components/edit_profile";

// Daily Challenge Game Pages
import DailyChallengeLobby from "./pages/daily_challenge/daily_challenge_lobby";

// Song Roulette Game Pages
import SongRouletteLobby from "./pages/song_roulette/song_roulette_lobby";
import SongRouletteGame from "./pages/song_roulette/song_roulette_game";

// Pictionary Game Pages
import PictionaryLobby from "./pages/pictionary/pictionary_challenge_lobby";

// Song Snippet Game Pages
import SongSnippetLobby from "./pages/song_snippet/song_snippet_lobby";

// Trivia Challenge Game Pages
import TriviaChallengeLobby from "./pages/trivia_challenge/trivia_challenge_lobby";

// Lyric Challenge Game Pages
import LyricChallengeLobby from "./pages/lyric_challenge/lyric_challenge_lobby";

import { useState, createContext, useContext } from "react";
export const UserContext = createContext(null);

function App() {
  const location = useLocation();
  const conditionalHeader =
    location.pathname === "/" ||
    location.pathname === "/signup" ? null : (
      <Header></Header>
    );
  const [user, setUser] = useState(null);

  if (user) {
    console.log("user is :" + user);
      return (
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
                      <Route path="/dailychallengelobby" element={<DailyChallengeLobby />} />
                      <Route path="/songroulettelobby" element={<SongRouletteLobby />} />
                      <Route path="/songroulettegame" element={<SongRouletteGame />} />
                      <Route path="/pictionarylobby" element={<PictionaryLobby />} />
                      <Route path="/songsnippetlobby" element={<SongSnippetLobby />} />
                      <Route path="/triviachallengelobby" element={<TriviaChallengeLobby />} />
                      <Route path="/lyricchallengelobby" element={<LyricChallengeLobby />} />
                    </Routes>
                  </UserContext.Provider>       
                </div>
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

        <AuthDetails></AuthDetails>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
         <Route path="*" element={<Navigate replace to="/" />} />

        </Routes>
      </UserContext.Provider>       
    </div>
  );
  }


}

export default App;
