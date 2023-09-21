import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
//import { useLocation } from "react-router-dom";
import SignIn from "./pages/signin_components/signin";
import SignUp from "./pages/signup_components/signup";
import AuthDetails from "./utils/authDetails";

function App() {
  //const location = useLocation();

  return (
    <div className="App">
      <AuthDetails></AuthDetails>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      
    </div>
  );
}

export default App;
