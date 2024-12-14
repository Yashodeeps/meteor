import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useTime } from "@/utils/TimeContext";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

const Timer = () => {
  const [mission, setMission] = useState("");
  const { remainingTime } = useTime() as any;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [newMission, setNewMission] = useState(mission);
  const [newEndDate, setNewEndDate] = useState("");

  useEffect(() => {
    chrome?.storage?.local.get(["timerPosition", "goals"], (data) => {
      if (data.timerPosition) {
        setPosition(data.timerPosition);
      }
      setMission(data.goals || "");
    });
  }, []);

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    e.preventDefault();
    setPosition(newPosition);
    chrome?.storage?.local.set({ timerPosition: newPosition }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving timer position", chrome.runtime.lastError);
      }
    });
  };

  const handleSave = () => {
    setMission(newMission);
    chrome?.storage?.local.set({ goals: newMission }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving mission", chrome.runtime.lastError);
      }
    });
    setIsEditing(false);
  };

  return ReactDOM.createPortal(
    <Draggable handle=".timer" position={position} onStop={handleStop}>
      <div
        className={`p-4 flex flex-col justify-center text-center items-center w-full timer cursor-grab max-w-screen-xl max-h-screen ${
          isEditing ? "border border-blue-500 rounded-lg bg-gray-900" : ""
        }`}
      >
        {!isEditing ? (
          <>
            <div
              className="text-5xl font-bold relative group"
              style={{ position: "relative" }}
            >
              {remainingTime}

              <button
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-gray-700 rounded-full p-1  transition duration-300"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
              </button>
            </div>
            <p className="p-3 text-center w-1/2">
              Days until {mission ? mission : " ..."}
            </p>
          </>
        ) : (
          <form
            className="flex flex-col items-center justify-center w-52 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="mission" className="text-sm">
                Edit Mission
              </label>
              <input
                id="mission"
                type="text"
                className="border rounded px-2 py-1 bg-gray-800 text-white"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="endDate" className="text-sm">
                Select End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="border rounded px-2 py-1 bg-gray-800 text-white"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Draggable>,
    document.body
  );
};

export default Timer;
