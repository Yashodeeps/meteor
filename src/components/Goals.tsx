// src/components/Goals.js
// import { useState, useEffect } from "react";

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
    <div>
      <h2>Goals</h2>

      <button>Add Goal</button>
    </div>
  );
};

export default Goals;
