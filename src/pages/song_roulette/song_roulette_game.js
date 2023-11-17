import Button from "@mui/material/Button";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { UserContext } from "../../App";

import { db } from "../../utils/firebase";
import { collection, onSnapshot, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { useTheme } from '@mui/material/styles';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');


function SongRouletteGame() {

    const theme = useTheme();
    const { user, setUser } = useContext(UserContext);

    /* Navigation for buttons */
    const navigate = useNavigate();

    const exitgame_click = () => {
      console.log("EXIT GAME CLICKED");
      navigate("/songroulettelobbybrowser");
    };

    const replayGame = () => {
      console.log("REPLAY GAME CLICKED");
      navigate("/songroulettelobbybrowser");
    };
    
    const location = useLocation();


    const rounds = location.state.rounds; // Get number of rounds from lobby page


    const lobbyGet = location.state.lobby;
    const [lobbyTemp, setLobbyTemp] = useState(lobbyGet);
    const peopleGet = location.state.people; // Get people array from lobby page
    

    var [people, setPeople] = useState(peopleGet);

    const song_bankGet = location.state.song_bank; // Get song_bank array from lobby page
    const[song_bank,setSongBank] = useState(song_bankGet);
    // song_bank = song_bankGet

    


    //console.log("NUMBER OF ROUNDS = " + rounds);
    //console.log(people);
    //console.log(location.state.people)
    if (!people) {
        people = location.state.people
    }
    //console.log(song_bank);
   console.log(lobbyTemp);

    const me = "" // should be name of current player
    //const meIndex2 = lobbyTemp.players.findIndex(lobbyTemp => lobbyTemp.players.includes(user) ); // change flag state when selected
   // console.log("meIndex2" + meIndex2);
    const [meIndex,setMeIndex] = useState(0);
    

    
    const [currentQuestion, setCurrentQuestion] = useState(0); // keeps track of question number
    const [showGame, setShowGame] = useState(true); // Determines when quiz ends
    const [selected, setSelected] = useState([]); // Answers the user has selected
    const [alertOpen, setAlertOpen] = useState(false); // Open/close dialog
    const [currentPoints, setCurrentPoints] = useState(0); // Points during each round
    let pointText = ""; // Text in dialog at the end
    const [pointTextState, setPointTextState] = useState("");    
    const [winner, setWinner] = useState(""); // To display winner in summary

    const [spotifyToken, setSpotifyToken] = useState(""); // Spotify Token
    const [userNameTemp2, setUserNameTemp2] = useState("");


    const [lobbies, setLobbies] = useState([]);

    var tempppy = location.state.currentLobby
    const [currentLobby, setCurrentLobby] = useState(lobbyGet);


    
    


    

  
  const getCurrentLobby =  () => {
    const tempThing =  findLobbyByPlayerId(lobbies, user);

    if (tempThing) {
      //setCurrentLobby(tempThing); // If a lobby is found, set the currentLobby state
      console.log("Current Lobby:", tempThing);
      //console.log("Current user ID:", user);
      //console.log("Current Lobby owner ID:", tempThing.ownerID);
    } else {
      //setCurrentLobby(null); // If no lobby is found, set currentLobby as null
      // console.log("No lobby found for the current user:", user);
    }
  };

    const handleOptionClick = (answerOption) => {
      console.log(answerOption);
      
      const indexToRemove = selected.indexOf(answerOption);
      const indexClicked = people.findIndex((person) => person.name === answerOption);

      if (indexClicked !== -1) { // Check if the person was found
          if (selected.includes(answerOption)) {
            console.log(answerOption + ' already selected, removing now');

            // Update the flag in the copied people array to change color
            const updatedPeople = [...people];
            updatedPeople[indexClicked].flag = false;
            setPeople(updatedPeople);

            if (indexToRemove !== -1) { // Remove answer option from selected
              selected.splice(indexToRemove, 1);
            }
          } else {
            selected.push(answerOption);
            var updatedPeople = [...people];
            updatedPeople[indexClicked].flag = true;
            setPeople(updatedPeople);
          }
      } else {
        console.log("Person not found in people array.");
      }
      
      console.log(selected);
      console.log(people);
      
      return;
    };
    
    const handleSubmitButtonClick = (answerOption) => { // Shows dialog with everyone's points
        // check user's selection
        checkAnswers(selected);
        setAlertOpen(true)
    };

    
    function findLobbyByPlayerId(updatedLobbies, targetId) {
      return updatedLobbies.find(lobby => lobby.players.includes(targetId));
    }


    const handleNextQuestion = () => { // Change question to next question
        // Increment question when Next Button is pressed
        setAlertOpen(false)
        
        // Reset (clearing previous question's selections)
        // reset answer option flags
        for (let i = 0; i < people.length; i++) { 
            people[i].flag = false;
        }
        // reset selected option (for next question)
        setSelected([]);

        if (currentQuestion == rounds - 1) { // Max rounds reached
            setShowGame(!showGame);

            /* CALCULATE WINNER */
            const sortedPeople = [...people];
            sortedPeople.sort((a, b) => b.points - a.points);

            let winners = "";
            let topScore = sortedPeople[0].points;
            for (let i = 1; i < sortedPeople.length; i++) {
                if (sortedPeople[i].points == topScore) { // tie found
                    winners += sortedPeople[i].name + ", "
                }    
            }

            if (winners != "") {
                winners += "and " + sortedPeople[0].name + " have won this game of Song Roulette! 🎉"
                setWinner(winners)
            }
            else {
                let gameWinner = sortedPeople[0].name + " has won this game of Song Roulette! 🎉"
                setWinner(gameWinner)
            }
            
        } 
        else if (currentQuestion < song_bank.length - 1) { // Change question to next question
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
        }
    }


  const getSpotifyToken = async () => {
    const unsubUserDoc = await onSnapshot(doc(db, "users", user), async (doc) => {
      setSpotifyToken(doc.data().spotifyToken);
      setUserNameTemp2(doc.data().username);
      //userNameTemp = doc.data().username;
      console.log('username is:' + userNameTemp2);

    });
  };


  const updateUserPoints = () => {
        // Logic to calculate updated points for the user

        console.log(people);

        const updatedPeopleArray = people[meIndex]; // Prepare updated user points data
        // Populate updatedPeopleArray with updated points for each user

        // Emit event to server with updated user points data
        socket.emit('update-user-points', { lobbyCode: currentLobby.code, updatedPeople: updatedPeopleArray, index: meIndex });
  };

socket.on('update-the-points', (updatedPerson , index) => {
    // Find the person to update based on their name
    console.log("update the pointz");
    console.log(updatedPerson);
    console.log(lobbyTemp);

    lobbyTemp.peopleGame[index].points = updatedPerson.points;
    /*
    
    const updatedPeople2 = people.map(person => {
        if (person.name === updatedPerson.name) {
            return {
                ...person,
                points: person.points + updatedPerson.points // Update points
            };
        }
        return person;
    });
    */

    // Set the updated people array in your state or wherever it's stored
    //setPeople(updatedPeople2);
});
    

  const handlePointsUpdate = () => {
        // Logic to update the user's points locally

        // Call function to update user points and emit event to server
        updateUserPoints();
    };

    useEffect(() => {
          // Example usage of the handlePointsUpdate function
          // Replace this with your actual logic where user points are updated
          //handlePointsUpdate();
    }, [/* Add dependencies as needed */]);

  /*

  useEffect(() => {
    // Only calculate `meIndex2` when `user` is available
    if (user && lobbyTemp && lobbyTemp.players) {
      const meIndex2 = lobbyTemp.players.findIndex(player => player === user);
       if (meIndex2 !== -1) {
                setMeIndex(meIndex2); // Set the index if it's found
    }
        console.log("meIndex" +meIndex2);
    }

    
  }, [user, lobbyTemp]);
    useEffect(() => {
      socket.emit('fetch-lobbies');
       socket.on('update-lobbies', (updatedLobbies) => {
          setLobbies(updatedLobbies);
          //setLobbyUsers(lobbies.);
          //console.log("lobbies should print");

          
          //console.log("lobbies should print");
          //console.log(updatedLobbies);

          //setCurrentLobby(updatedLobbies[0]);
          //getCurrentLobby();
          //setLobbyUsers(currentLobby.players);
      });

    }, []);;

    */

    function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  });
}

    

    
    useEffect(() => {
        socket.emit('fetch-lobbies');

        socket.on('update-lobbies', (updatedLobbies) => {
            setLobbies(updatedLobbies);
        });
    }, []); 

 


    useEffect(() => {
        // Only calculate `meIndex2` when `user` is available
        if (user && lobbyTemp && lobbyTemp.players) {
            const meIndex2 = lobbyTemp.players.findIndex(player => player === user);
            if (meIndex2 !== -1) {
                setMeIndex(meIndex2); // Set the index if it's found ???? test
            }
        }
    }, [user, lobbyTemp]);

     useEffect(() => {
        getSpotifyToken();
    }, [spotifyToken]);
   
    


    const checkAnswers = (selected) => {
        /*  
         *   SYSTEM FOR AWARDING POINTS
         *      each correct answer = +100  
         *      each wrong answer = -50
         *      each missing answer = -25
         *      no answer selected = -25
        */

        console.log("CHECKING ANSWER")

        let curPoints = 0 // total points for current round
        
        // Correct answer and wrong answer scoring
        for (var i = 0; i < selected.length; i++) {
            const selectedName = selected[i];
            const correctAnswers = song_bank[currentQuestion].correctAnswer;

            console.log(selectedName + ", " + correctAnswers);

            // each correct answer (+100)
            if (correctAnswers.some(answer => answer === selectedName)) {
                curPoints += 100;

                pointText += "Correct Answer +100\n"
                console.log(pointText)
                console.log("Correct answer found! +100, points = " + curPoints);
            }
            // each wrong answer (-50)
            if (correctAnswers.every(answer => answer !== selectedName)) {
                curPoints -= 50;

                pointText += "Wrong Answer -50\n"
                console.log(pointText)
                console.log("Selected answer is not a correct answer! -50, points = " + curPoints);
            }
        }

        // Missing answer scoring
        const correctAnswers = song_bank[currentQuestion].correctAnswer;
        for (var i = 0; i < correctAnswers.length; i++) {
            console.log(correctAnswers[i])
            // each missing answer (-25)
            if (!selected.includes(correctAnswers[i])){
                curPoints -= 25;

                pointText += "Missing Answer -25\n"
                console.log(pointText)
                console.log("Missing answer! -25, points = " + curPoints);
            }
        }

        console.log("curPoints total before capping: " +  curPoints);

        if (curPoints < 0) { // Cap curPoints at 0 if less than 0
            console.log("Total points under 0! Current points now 0.")
            curPoints = 0;
        }

        // Add curPoints to total points
        const updatedPeople = [...people];
        //setMeIndex(userNameTemp2);
        updatedPeople[meIndex].points = people[meIndex].points + curPoints;
        setPeople(updatedPeople);

        console.log(people);

        // update state of current points for pop up message
        setCurrentPoints(curPoints);
        setPointTextState(pointText)
        console.log(lobbyTemp);
        lobbyTemp.points[meIndex]+= curPoints;

        handlePointsUpdate();

        // Emit the updated lobby data through the socket
        //socket.emit('update-lobby', lobbyTemp);

 
        // Example usage: Call this function when the user's points are updated
        // For instance, after the 'checkAnswers' function
        const updatedPeopleArray = [...people]; // Assuming people is the updated array of users
        console.log(updatedPeopleArray);
        //updateUserPoints(currentLobby.code, updatedPeopleArray);
            
    }
    /*  
          useEffect(()=>{

      //getSpotifyToken()
      if (spotifyToken) {
        console.log("spotify token got in song roulette game lobby ->", spotifyToken)
        // get specific playlist code (user entered or from firebase?) (future sprint) (hard-coded)

        //console.log(people);
        console.log("meIndex" +meIndex);
      
      }
      
      
    }, [spotifyToken]);
    */

    
    
    return (
    <div>
    {showGame ? (
        <div style={{ marginTop: "2%", marginBottom: "2%", marginLeft: "10%", marginRight: "10%" }}>

        <Typography variant="h3" style={{ textAlign: "center"}}>
           Round {currentQuestion + 1} of {rounds}
        </Typography>
        <br></br>
             <React.Profiler id="MyComponent" onRender={onRenderCallback}></React.Profiler>
          <Card elevation={3} style={{ position: 'relative', border: `2px solid ${theme.palette.primary.main}`, borderRadius: "8px", backgroundColor: theme.palette.background.default }}>
            {/* Cancel Icon */}
            <CancelIcon
                style={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: '15px',
                right: '15px',
                height: '40px',
                width: '40px',
                cursor: 'pointer',
                zIndex: 1, 
                }}
                onClick={() => exitgame_click()} 
            />
            
            <CardContent>
            <br></br>
            <iframe 
                style={{ borderRadius: '12px' }}
                src={song_bank[currentQuestion].song}
                width="70%" 
                height="200" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
                <Grid xs={8} sm={6}>
                {people.map(person => (
                    <Button
                        key={person.name}
                        sx={{
                        width: 300,
                        border: `2px solid ${theme.palette.primary.main}`,
                        padding: 1,
                        margin: { xs: 4, sm: 4 },
                        backgroundColor: person.flag ? theme.palette.secondary.main : theme.palette.background.default,
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                        },
                        //borderWidth: "2px",
                        }}
                        onClick={() => handleOptionClick(person.name)}
                    >
                    {person.name}
                    </Button>
                ))}
                </Grid>
            </CardContent>
        </Card>
        <Button
          variant="contained"
          style={{
            width: 230,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.secondary.main,
            textTransform: "none",
            fontSize: 15,
            fontWeight: "bold",
            margin: "3%"
          }}
          onClick={handleSubmitButtonClick}
        >
          Submit
        </Button>

        <Dialog open={alertOpen} onClose={handleNextQuestion} PaperProps={{ style: { backgroundColor: theme.palette.background.default } }}>
        <DialogTitle>
        <Typography variant="h3" style={{ textAlign: "center", marginBottom: "-15px" }}>
            Results
        </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            <pre>{pointTextState}</pre>
          </Typography>
         <Typography variant="h4" style={{ textAlign: "center" }}>
            You earned {currentPoints} points in this round!
            Your total points earned in this game are {people[meIndex].points}.
          </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
            style={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.secondary.main,
              textTransform: "none",
              fontSize: 15,
              fontWeight: "bold"
              }}  
            onClick={handleNextQuestion} >
            Next Question
          </Button>
        </DialogActions>
        </Dialog>

        </div>
    ) : (
        <div>
            <Typography variant="h2" style={{ textAlign: "center" }}>
                Song Roulette Summary
            </Typography>
            <br></br>
            {people.map(person => (
                <div>
                <Typography variant="h3" style={{ textAlign: "center" }}>
                    {person.name} earned {person.points} points!
                </Typography>
                </div>
            ))}
            <br></br>
             <Typography variant="h3" style={{ textAlign: "center" }}>
                {winner} 
            </Typography>

            <Button
                    sx={{
                    width: 300,
                    border: `2px solid ${theme.palette.primary.main}`,
                    padding: 1,
                    margin: { xs: 4, sm: 4 },
                    backgroundColor: 'white',
                    "&:hover": {
                        backgroundColor: 'var(--accent-color)',
                    },
                    borderWidth: "2px",
                    }}
                    onClick={replayGame}
                >
                Replay
                </Button>
            
        </div>
    )}
    </div>
    );
}

export default SongRouletteGame;