// src/components/Timer.js
// import { useState, useEffect } from "react";

import { useTime } from "@/utils/TimeContext";
import { useState } from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";

const Timer = () => {
  const [mission, setMission] = useState("");
  const { remainingTime } = useTime() as any;

  chrome?.storage?.local.get("remainingTime", (data) => {
    if (data.remainingTime) {
      // No need to update state, as the useEffect in TimeProvider handles it
    }
  });
  chrome?.storage?.local.get("goals", (data) => {
    setMission(data.goals || []);
  });

  return ReactDOM.createPortal(
    <Draggable handle=".timer">
      <div className="p-4 flex flex-col justify-center text-center items-center w-full timer cursor-pointer max-w-screen-xl max-h-screen">
        <div className="text-5xl font-bold">{remainingTime}</div>
        <p className="p-3 text-center  w-1/2">
          Days until {mission ? mission : " ..."}
        </p>
      </div>
    </Draggable>,
    document.body
  );
};

export default Timer;
