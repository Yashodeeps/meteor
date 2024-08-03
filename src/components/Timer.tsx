// src/components/Timer.js
// import { useState, useEffect } from "react";

import { useTime } from "@/utils/TimeContext";
import { useState } from "react";

const Timer = () => {
  const [mission, setMission] = useState("");
  const { remainingTime } = useTime() as any;

  chrome.storage.local.get("remainingTime", (data) => {
    if (data.remainingTime) {
      // No need to update state, as the useEffect in TimeProvider handles it
    }
  });
  chrome.storage.local.get("goals", (data) => {
    setMission(data.goals || []);
  });

  return (
    <div className="p-4 flex flex-col justify-center text-center items-center w-full">
      <div className="text-5xl font-bold">{remainingTime}</div>
      <p className="p-3 text-center  w-1/2">
        Days until {mission ? mission : " ..."}
      </p>
    </div>
  );
};

export default Timer;
