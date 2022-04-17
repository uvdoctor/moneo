import { Col, Row } from "antd";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CreateGoalInput } from "../../api/goals";
import { ROUTES } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import { calculateFI } from "../goals/fiutils";
import { loadAllGoals } from "../goals/goalutils";
import { DBContext } from "./DBContext";

export default function SetResult() {
  const { fxRates, totalAssets, totalLiabilities }: any = useContext(DBContext);
  const { userInfo, defaultCurrency }: any = useContext(AppContext);
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffYear, setFFYear] = useState<number | null>(null);
  const [ffAmt, setFFAmt] = useState<number>(0);
  const [numOfGoals, setNumOfGoals] = useState<number>(0);
  const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(null);

  useEffect(() => {
    loadAllGoals(userInfo).then((result: any) => {
      const ffGoal = result.ffGoal;
      setFFGoal(ffGoal);
      const goals = result.goals;
      const allCFs = result.allCFs;
      const fiResult: any = calculateFI(
        ffGoal,
        null,
        goals,
        allCFs,
        false,
        defaultCurrency,
        fxRates
      );
      setFFYear(fiResult.ffYear);
      setNumOfGoals(goals.length);
      setFFAmt(fiResult.ffResult?.ffAmt);
      setGoalsLoaded(true);
    });
  }, []);

  return (
    <Link href={ROUTES.SET}>
      <a>
        <Row>
          <Col span={24}>
            <ItemDisplay
              label="Financial Independence Age"
              result={
                !ffGoal
                  ? "Not defined"
                  : ffYear
                  ? ffYear - ffGoal.sy
                  : "Not achievable"
              }
              info={"Earliest age when you can achieve financial independence."}
              loading={!goalsLoaded}
            />
            {!ffGoal ? (
              <a href={ROUTES.SET}>Discover financial independence age</a>
            ) : null}
          </Col>
          <Col xs={12}>
            <ItemDisplay
              label="Amount needed"
              result={ffAmt}
              currency={defaultCurrency}
              loading={!goalsLoaded}
              info="This is the minimum amount needed to achieve financial independence."
            />
          </Col>
          {totalAssets || totalLiabilities ? (
            <Col xs={12}>
              <ItemDisplay
                label="Number of Goals"
                result={numOfGoals}
                loading={!goalsLoaded}
                info="Number of goals defined in the financial plan."
              />
            </Col>
          ) : null}
        </Row>
      </a>
    </Link>
  );
}
