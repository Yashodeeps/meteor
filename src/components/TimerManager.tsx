import { useEffect, useState } from "react";
import Timer from "./Timer";

interface TimerType {
  id: string;
  mission: string;
  startDate?: string;
  endDate: string;
  isRunning?: boolean;
  remainingTime?: string;
  timerPosition?: { x: number; y: number };
}

const TimerManager = () => {
  const [timers, setTimers] = useState<TimerType[]>([]);

  useEffect(() => {
    // Load initial timers
    chrome?.storage?.local.get(["timers"], (data) => {
      if (data.timers) {
        setTimers(data.timers);
      }
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

  return (
    <div>
      {timers.map((timer) => (
        <Timer
          key={timer.id}
          id={timer.id} // Fixed: Pass the ID
          mission={timer.mission}
          endDate={timer.endDate}
          timerPosition={timer.timerPosition}
        />
      ))}
    </div>
  );
};

export default TimerManager;
