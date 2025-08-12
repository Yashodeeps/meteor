import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useTime } from "@/utils/TimeContext";
import { Edit, Check, X, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import "@/index.css";

const Timer = ({
  id,
  mission,
  endDate,
  timerPosition,
}: {
  id: string;
  mission: string;
  endDate: string;
  timerPosition?: { x: number; y: number };
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMission, setNewMission] = useState(mission || "");
  const [newEndDate, setNewEndDate] = useState(
    endDate ? endDate.split("T")[0] : ""
  );
  const [position, setPosition] = useState(timerPosition || { x: 0, y: 0 });

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const timerRef = useRef<HTMLDivElement>(null);

  const { remainingTime } = useTime() as {
    remainingTime: Array<{ id: string; time: string }>;
  };

  const remainingTimeOfTimer =
    remainingTime.find((time: any) => time.id === id)?.time || "0.000000";

  // Calculate bounds based on screen size and timer dimensions
  useEffect(() => {
    const updateBounds = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const timerWidth = isEditing ? 350 : 300;
      const timerHeight = isEditing ? 400 : 150;

      setBounds({
        left: 0,
        top: 0,
        right: screenWidth - timerWidth,
        bottom: screenHeight - timerHeight,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [isEditing]);

  // Ensure initial position is within bounds
  useEffect(() => {
    if (bounds.right > 0 && bounds.bottom > 0 && !isEditing) {
      const constrainedPosition = {
        x: Math.max(bounds.left, Math.min(position.x, bounds.right)),
        y: Math.max(bounds.top, Math.min(position.y, bounds.bottom)),
      };

      if (
        constrainedPosition.x !== position.x ||
        constrainedPosition.y !== position.y
      ) {
        setPosition(constrainedPosition);

        chrome?.storage?.local.get("timers", (result) => {
          const timers = result.timers || [];
          const updatedTimers = timers.map((timer: any) =>
            timer.id === id
              ? { ...timer, timerPosition: constrainedPosition }
              : timer
          );
          chrome?.storage?.local.set({ timers: updatedTimers });
        });
      }
    }
  }, [bounds, id, isEditing]);

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    const constrainedPosition = {
      x: Math.max(bounds.left, Math.min(data.x, bounds.right)),
      y: Math.max(bounds.top, Math.min(data.y, bounds.bottom)),
    };

    e.preventDefault();
    setPosition(constrainedPosition);

    chrome?.storage?.local.get("timers", (result) => {
      const timers = result.timers || [];
      const updatedTimers = timers.map((timer: any) =>
        timer.id === id
          ? { ...timer, timerPosition: constrainedPosition }
          : timer
      );
      chrome?.storage?.local.set({ timers: updatedTimers }, () => {
        console.log("Timer position updated:", constrainedPosition);
      });
    });
  };

  const handleSave = () => {
    chrome?.storage?.local.get("timers", (result) => {
      const timers = result.timers || [];
      const updatedTimers = timers.map((timer: any) =>
        timer.id === id
          ? {
              ...timer,
              mission: newMission,
              endDate: newEndDate
                ? new Date(newEndDate).toISOString()
                : timer.endDate,
            }
          : timer
      );
      chrome?.storage?.local.set({ timers: updatedTimers }, () => {
        console.log("Timer updated:", {
          mission: newMission,
          endDate: newEndDate,
        });
        setIsEditing(false);
      });
    });
  };

  const handleDelete = () => {
    chrome?.storage?.local.get("timers", (result) => {
      const timers = result.timers || [];
      const updatedTimers = timers.filter((timer: any) => timer.id !== id);
      chrome?.storage?.local.set({ timers: updatedTimers }, () => {
        console.log("Timer deleted:", id);
      });
    });
  };

  const handleCancel = () => {
    setNewMission(mission || "");
    setNewEndDate(endDate ? endDate.split("T")[0] : "");
    setIsEditing(false);
  };

  return ReactDOM.createPortal(
    <Draggable
      handle=".timer"
      position={position}
      onStop={handleStop}
      bounds={bounds}
      disabled={isEditing}
    >
      <div
        ref={timerRef}
        className={`
          timer select-none
          ${
            isEditing
              ? "relative cursor-default bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-[350px]"
              : "p-4 w-fit cursor-grab active:cursor-grabbing relative"
          }
        `}
        style={{ fontFamily: "Syne Mono" }}
      >
        {isEditing && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="absolute top-1 right-1 bg-white/10 border-white/20 text-white hover:bg-white/20
                            rounded-lg transition-all duration-200"
            onClick={handleCancel}
          >
            <X size={16} />
          </Button>
        )}
        {/* Timer Display - Always Visible */}
        <div
          className={`
          flex flex-col items-center text-center relative
          ${isEditing ? "mb-6" : ""}
        `}
        >
          <div className="relative group">
            <div
              className={`
              font-bold relative
              ${isEditing ? "text-4xl" : "text-7xl"}
               
            `}
            >
              {remainingTimeOfTimer}

              {!isEditing && (
                <button
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                           bg-white/20 backdrop-blur-sm hover:bg-white/30 
                           rounded-full p-2 transition-all duration-300
                           border border-white/20 hover:border-white/40"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} className="text-white" />
                </button>
              )}
            </div>

            <p
              className={`
              font-bold text-center 
              ${isEditing ? "text-sm mt-1 text-white/80" : "text-xl mt-3"}
            `}
            >
              {mission || "ENTER YOUR GRAND MISSION"}
            </p>
          </div>
        </div>

        {/* Edit Form - Only in Editing Mode */}
        {isEditing && (
          <div className="animate-fadeIn relative">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="space-y-2">
                <label className="text-lg font-medium text-white/90 uppercase tracking-wide">
                  Mission
                </label>
                <Input
                  type="text"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50
                           focus:border-white/40 focus:bg-white/15 rounded-xl h-12
                           transition-all duration-200 text-lg"
                  placeholder="Launch MVP"
                  value={newMission}
                  onChange={(e) => setNewMission(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-white/90 uppercase tracking-wide">
                  Deadline
                </label>
                <Input
                  type="date"
                  className="bg-white/10 border-white/20 text-white
                           focus:border-white/40 focus:bg-white/15 rounded-xl h-12
                           transition-all duration-200 text-lg"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white  shadow-lg border-0 rounded-lg
                           transition-all duration-200 font-medium"
                >
                  <Check size={16} className="mr-1" />
                  Save
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="bg-red-600/80 hover:bg-red-600 border-0 rounded-lg
                           transition-all duration-200"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Draggable>,
    document.body
  );
};

export default Timer;
