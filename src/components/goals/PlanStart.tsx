import { Button } from "antd";
import React, { useContext } from "react";
import { GoalType } from "../../api/goals";
import { AppContext } from "../AppContext";
import { createNewGoalInput } from "./goalutils";
import { PlanContext } from "./PlanContext";

export default function PlanStart() {
  const { defaultCurrency }: any = useContext(AppContext);
  const { setGoal }: any = useContext(PlanContext);

  return (
    <div style={{ textAlign: "center" }}>
      <p>&nbsp;</p>
      <h3>First things first.</h3>
      <h3>Set your Financial Independence target.</h3>
      <p>&nbsp;</p>
      <Button
        type="primary"
        onClick={() =>
          setGoal(createNewGoalInput(GoalType.FF, defaultCurrency))
        }>
        Get Started
      </Button>
      <p>&nbsp;</p>
    </div>
  );
}
