import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { useLocation } from "react-router-dom";

import Header from "./pages/header";
import SignIn from "./pages/signin_components/signin";
import SignUp from "./pages/signup_components/signup";
import Profile from "./pages/profile_components/profile";
import Homepage from "./pages/homepage";

function App() {
  const location = useLocation();
  const conditionalHeader =
    location.pathname === "/" ||
    location.pathname === "/signup" ? null : (
      <Header></Header>
    );

  return (
    <div className="App">
      {conditionalHeader}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
