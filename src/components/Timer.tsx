// src/components/Timer.js
// import { useState, useEffect } from "react";

const Timer = () => {
  //   const [time, setTime] = useState(0);
  //   const [isRunning, setIsRunning] = useState(false);

  //   useEffect(() => {
  //     let interval: any;
  //     if (isRunning) {
  //       interval = setInterval(() => {
  //         setTime((prevTime) => prevTime + 1);
  //       }, 1000);
  //     } else if (!isRunning && time !== 0) {
  //       clearInterval(interval);
  //     }
  //     return () => clearInterval(interval);
  //   }, [isRunning, time]);

  //   const handleStart = () => setIsRunning(true);
  //   const handleStop = () => setIsRunning(false);
  //   const handleReset = () => {
  //     setIsRunning(false);
  //     setTime(0);
  //   };

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div className="text-5xl font-bold "> 58.000 </div>
      <p>Days until </p>
    </div>
  );
};

export default Timer;
