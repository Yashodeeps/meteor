import { Notebook, PenSquare, Timer } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";
import ToolTipButton from "./ToolTipButton";

const Toolbar = () => {
  // Function to generate a safe position within screen bounds
  const getSafePosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Estimate timer dimensions (default size when not editing)
    const timerWidth = 300;
    const timerHeight = 150;

    // Calculate safe bounds
    const maxX = Math.max(0, screenWidth - timerWidth);
    const maxY = Math.max(0, screenHeight - timerHeight);

    // Generate a somewhat random but safe position
    // Avoid positioning too close to the edges by adding some margin
    const margin = 50;
    const safeX = Math.random() * Math.max(0, maxX - margin * 2) + margin;
    const safeY = Math.random() * Math.max(0, maxY - margin * 2) + margin;

    return {
      x: Math.floor(safeX),
      y: Math.floor(safeY),
    };
  };

  const addTimer = () => {
    console.log("Adding new timer");
    chrome?.storage?.local.get("timers", (result) => {
      const timers = result.timers ?? [];

      // Get existing positions to avoid overlap if possible
      const existingPositions = timers.map(
        (timer: any) => timer.timerPosition || { x: 0, y: 0 }
      );

      // Generate initial safe position
      let newPosition = getSafePosition();

      // Try to avoid overlap with existing timers
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const hasOverlap = existingPositions.some((pos: any) => {
          const distance = Math.sqrt(
            Math.pow(newPosition.x - pos.x, 2) +
              Math.pow(newPosition.y - pos.y, 2)
          );
          return distance < 200; // Minimum distance between timers
        });

        if (!hasOverlap) break;

        newPosition = getSafePosition();
        attempts++;
      }

      const newTimer = {
        id: nanoid(),
        mission: "Enter your mission",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isRunning: false,
        remainingTime: "0",
        timerPosition: newPosition,
      };

      const updatedTimers = [...timers, newTimer];
      chrome?.storage?.local.set({ timers: updatedTimers }, () => {
        console.log("Timer added:", newTimer);
      });
    });
  };

  return (
    <div
      className="fixed top-1/2 left-4 -translate-y-1/2 flex flex-col gap-3 p-1 rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30"
      style={{
        zIndex: 1000,

        alignItems: "center",
      }}
    >
      <ToolTipButton tooltipContent="Add mission timers" side="right">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-sky-900 "
          onClick={addTimer}
        >
          <Timer />
        </Button>
      </ToolTipButton>
      <ToolTipButton tooltipContent="Add mission timers" side="right">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-sky-900 "
          onClick={addTimer}
        >
          <Notebook />
        </Button>
      </ToolTipButton>
      <ToolTipButton tooltipContent="Add mission timers" side="right">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-sky-900 "
          onClick={addTimer}
        >
          <PenSquare />
        </Button>
      </ToolTipButton>
    </div>
  );
};

export default Toolbar;
