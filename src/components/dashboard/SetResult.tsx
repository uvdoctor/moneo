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
  const { fxRates, aa, setAA }: any = useContext(DBContext);
  const { userInfo, defaultCurrency }: any = useContext(AppContext);
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffYear, setFFYear] = useState<number | null>(null);
  const [ffAmt, setFFAmt] = useState<number>(0);
  const [numOfGoals, setNumOfGoals] = useState<number>(0);
  const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(null);

  useEffect(() => {
    loadAllGoals(userInfo).then((result: any) => {
      const ffGoal = result.ffGoal;
      if (!ffGoal) {
        setGoalsLoaded(true);
        return;
      }
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
      setFFYear(fiResult?.ffYear);
      setNumOfGoals(goals.length);
      setFFAmt(fiResult?.ffResult?.ffAmt);
      setAA(fiResult?.ffResult.aa);
    });
  }, []);

  useEffect(() => {
    setGoalsLoaded(true);
  }, [aa]);

  return (
    <Link href={ROUTES.SET}>
      <a>
        <Row>
          <Col span={24}>
            <ItemDisplay
              label="Financial Independence Age"
              result={
                ffGoal
                  ? ffYear
                    ? ffYear - ffGoal.sy
                    : "Not achievable"
                  : "Discover"
              }
              info={"Earliest age when you can achieve financial independence."}
              loading={!goalsLoaded}
              unit={ffYear ? "years" : ""}
            />
          </Col>
          <Col xs={12}>
            <ItemDisplay
              label="Amount needed"
              result={ffAmt ? ffAmt : "Discover"}
              currency={defaultCurrency}
              loading={!goalsLoaded}
              info="This is the minimum amount needed to achieve financial independence."
            />
          </Col>
          <Col xs={12}>
            <ItemDisplay
              label={numOfGoals ? "Number of Goals" : "Goals"}
              result={numOfGoals ? numOfGoals : "Define"}
              loading={!goalsLoaded}
              info={
                numOfGoals
                  ? "Number of goals defined in the financial plan."
                  : "Define your financial goals with easy-to-use goal templates so that you get a more accurate investment plan linked to your goals."
              }
            />
          </Col>
        </Row>
      </a>
    </Link>
  );
}
