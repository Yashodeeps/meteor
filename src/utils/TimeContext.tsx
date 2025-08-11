import { createContext, useState, useEffect, useContext } from "react";

const TimeContext = createContext({});

interface RemainingTimeType {
  id: string;
  time: string;
}

export const TimeProvider = ({ children }: any) => {
  const [timers, setTimers] = useState([]);
  const [remainingTime, setRemainingTime] = useState<RemainingTimeType[]>([]);

  useEffect(() => {
    // Load timers from storage
    chrome?.storage?.local.get("timers", (data) => {
      setTimers(data.timers || []);
    });

    // Listen for storage changes
    const handleStorageChange = (changes: any, area: string) => {
      if (area === "local" && changes.timers) {
        setTimers(changes.timers.newValue || []);
      }
    };

    chrome?.storage?.onChanged.addListener(handleStorageChange);

    return () => {
      chrome?.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (timers.length === 0) return;

    // Single interval to update all timers
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTimes: RemainingTimeType[] = [];

      timers.forEach((timer: any) => {
        const target = new Date(timer.endDate);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
          updatedTimes.push({
            id: timer.id,
            time: "0.000000",
          });
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          updatedTimes.push({
            id: timer.id,
            time: `${days}.${hours.toString().padStart(2, "0")}${minutes
              .toString()
              .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`,
          });
        }
      });

      setRemainingTime(updatedTimes);
    }, 1000); // Update every second instead of every millisecond

    return () => clearInterval(interval);
  }, [timers]);

  return (
    <TimeContext.Provider value={{ remainingTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
