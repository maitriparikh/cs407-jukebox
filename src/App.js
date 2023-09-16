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


function App() {
  //const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
