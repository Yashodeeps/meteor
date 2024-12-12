// src/components/Goals.js
// import { useState, useEffect } from "react";

import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useTime } from "@/utils/TimeContext";

const Goals = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [daysDifference, setDaysDifference] = useState("");
  const [mission, setMission] = useState("");
  const { setTargetDate } = useTime() as any;
  const [runningMissions, setRunningMissions] = useState<any>([]);

  const [goals, setGoals] = useState<any>([]);

  const startTimer = () => {
    if (selectedDate) {
      chrome?.storage?.local.set({ targetDate: selectedDate });
      setTargetDate(selectedDate);
    }
    if (mission) {
      addGoal(mission);
    }
  };

  const stopTimer = () => {
    chrome?.storage?.local.set({ targetDate: Date.now() });
    setTargetDate(Date.now());
    chrome?.storage?.local.set({ goals: [] });
  };

  useEffect(() => {
    chrome?.storage?.local.get("goals", (data) => {
      setGoals(data.goals || []);
    });
  }, [stopTimer, startTimer]);

  const addGoal = (goal: any) => {
    // const newGoals = [...goals, goal];
    console.log(goals);
    const newGoals = [goal];
    setGoals(newGoals);
    chrome?.storage?.local.set({ goals: newGoals });
  };

  const calculateDaysDifference = (date: any) => {
    const currentDate: any = new Date();
    const targetDate: any = new Date(date);

    if (targetDate <= currentDate) {
      setDaysDifference("0.000000"); // If the target date is in the past or today
      return;
    }

    const diffTime = targetDate - currentDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
    const diffHours = (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    const diffMinutes = (diffTime % (1000 * 60 * 60)) / (1000 * 60);
    const diffSeconds = (diffTime % (1000 * 60)) / 1000;

    const result = `${diffDays.toFixed(0)}.${Math.floor(diffHours)
      .toString()
      .padStart(2, "0")}${Math.floor(diffMinutes)
      .toString()
      .padStart(2, "0")}${Math.floor(diffSeconds).toString().padStart(2, "0")}`;
    setDaysDifference(result);
  };
  const handleDateChange = (event: { target: { value: any } }) => {
    const date = event.target.value;
    setSelectedDate(date);
    calculateDaysDifference(date);
  };

  useEffect(() => {
    chrome?.storage?.local.get("goals", (data) => {
      setRunningMissions([...runningMissions, data.goals]);
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          {" "}
          <Settings2 />
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>missions</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-lg ">
          {runningMissions &&
            runningMissions.map((mission: any, index: any) => (
              <div key={index} className="flex justify-between">
                <div> {mission}</div>
              </div>
            ))}{" "}
        </div>

        <div className="flex flex-col gap-5">
          <Label>add new</Label>
          <Input
            type="text"
            placeholder="eg, launch Meteor extension"
            value={mission}
            onChange={(e) => {
              setMission(e.target.value);
            }}
          />

          <Label>End date</Label>
          <div className="flex gap-3 items-center">
            <Input
              type="date"
              className="w-1/2 "
              value={selectedDate}
              onChange={handleDateChange}
            />
            <Input
              type="number"
              className="w-1/2"
              value={daysDifference}
              readOnly
            />
            <div> days</div>
          </div>
        </div>
        <Separator />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button variant={"secondary"} onClick={stopTimer}>
            Stop current
          </Button>
          <Button variant={"default"} onClick={startTimer}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Goals;
