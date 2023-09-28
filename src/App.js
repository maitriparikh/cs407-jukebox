import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import SongRouletteLobby from "./pages/song_roulette/song_roulette_lobby";
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
          <Route path="/songroulettelobby" element={<SongRouletteLobby />} />
        </Routes>
      </UserContext.Provider>  
    </div>
  );
}

export default App;
