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

const Goals = () => {
  // const [goals, setGoals] = useState<any>([]);

  // useEffect(() => {
  //   chrome.storage.local.get("goals", (data) => {
  //     setGoals(data.goals || []);
  //   });
  // }, []);

  // const addGoal = (goal: any) => {
  //   const newGoals = [...goals, goal];
  //   setGoals(newGoals);
  //   chrome.storage.local.set({ goals: newGoals });
  // };

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
          <DialogTitle>Set Timeline</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <Label>Select time</Label>
          <div className="flex gap-3 justify-center items-center">
            <Input type="number" className="w-12 overflow-hidden scroll-none" />
            <div> days</div>
          </div>
          <Label>Tagline</Label>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Goals;
