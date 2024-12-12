// src/utils/TimeContext.js
import { createContext, useState, useContext, useEffect } from "react";

const TimeContext = createContext({});

export const TimeProvider = ({ children }: any) => {
  const [targetDate, setTargetDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState("0.000000");

  useEffect(() => {
    chrome?.storage?.local.get("targetDate", (data) => {
      setTargetDate(data.targetDate || "");
    });

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (targetDate) {
      const interval = setInterval(() => {
        const now: any = new Date();
        const target: any = new Date(targetDate);
        const diff = target - now;

        if (diff <= 0) {
          setRemainingTime("0.000000");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24) + 1);
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          setRemainingTime(
            `${days}.${hours.toString().padStart(2, "0")}${minutes
              .toString()
              .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`
          );
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [targetDate, currentDate]);

  useEffect(() => {
    chrome?.storage?.local.set({ remainingTime });
  }, [remainingTime]);

  return (
    <TimeContext.Provider value={{ targetDate, setTargetDate, remainingTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
