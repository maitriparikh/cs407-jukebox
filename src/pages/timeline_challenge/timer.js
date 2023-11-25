import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

const Timer = ({ maxTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(maxTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  return (
    <Typography variant="h2" style={{ textAlign: "center" }}>
      {formatTime(timeLeft)}
    </Typography>
  );
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default Timer;
