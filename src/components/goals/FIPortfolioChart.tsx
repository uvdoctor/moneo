import React, { useState, useEffect, useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import { GoalType, UpdateGoalInput } from '../../api/goals';
import { PlanContext } from './PlanContext';
import { getGoalTypes } from './goalutils';
import { appendValue } from '../utils';
import BasicLineChart from './BasicLineChart';
import { COLORS } from '../../CONSTANTS';
import { FIGoalContext } from './FIGoalContext';
import { Skeleton } from 'antd';

export default function FIPortfolioChart() {
	const { goal, allGoals, allCFs, rr, ffYear, ffGoal }: any = useContext(PlanContext);
  const { wipGoal, cfs }: any = useContext(CalcContext);
  const { wipResult }: any = useContext(FIGoalContext);
  const [tooltips, setTooltips] = useState<any>({});
  const [dataMarkers, setDataMarkers] = useState<Array<string>>([]);
  const [lineAnnotations, setLineAnnotations] = useState<Array<any>>([]);

  const getLineAnnotations = () => {
    let startYear = goal ? wipGoal.sy : ffGoal.sy;
    let planDuration = goal ? wipGoal.loan?.dur : ffGoal.loan?.dur;
    let fiYear = goal ? wipResult.ffYear : ffYear;
    let endPlanContent = {
      year: startYear + planDuration,
      color: COLORS.ORANGE,
      position: '20%',
      content: `Plan ends at Age of ${planDuration}`
    }
    if (!fiYear) {
      return [endPlanContent];
    }
    let ffContent = {
      year: fiYear,
      color: COLORS.GREEN,
      position: '10%',
      content: `Financial Independence at Age of ${fiYear - startYear}`
    }
    return [ffContent, endPlanContent];
  };

  const getDataMarkers = () => {
    if (!allGoals.length || !cfs.length || !rr || !rr.length) {
      return [];
    }
    let startingGoalsContent: any = {};
    let endingGoalsContent: any = {};
    let runningGoalsContent: any = {};
    let dataMarkers: Array<string> = [];
    allGoals.map((g: UpdateGoalInput) => {
      let startYear = g.sy as number;
      let cfs = allCFs[g.id];
      let endYear = startYear + (g.type === GoalType.B ? (g.sm as number > 1 ? g?.sa as number : (g?.sa as number - 1)) : cfs.length - 1);
      for (let y = startYear + 1; y < endYear; y++) {
        appendValue(runningGoalsContent, y, getAnnotationRunningYearContent(g));
      }
      appendValue(startingGoalsContent, startYear, getAnnotationContent(g));
      appendValue(endingGoalsContent, endYear, getAnnotationEndYearContent(g));
    });
    setTooltips(generateTooltipContent(startingGoalsContent, runningGoalsContent, endingGoalsContent));
    Object.keys(startingGoalsContent).map((key: string) => dataMarkers.push(key));
    Object.keys(endingGoalsContent).map((key: string) => {
      if (!startingGoalsContent.hasOwnProperty(key)) dataMarkers.push(key);
    });
    return dataMarkers;
  };

  useEffect(() => {
    setLineAnnotations([...getLineAnnotations()]);
    setDataMarkers([...getDataMarkers()]);
	}, [cfs, rr]);

	const getAnnotationContent = (g: UpdateGoalInput) => `${getGoalTypes()[g.type as GoalType]} ${g.name}`;

	const getAnnotationEndYearContent = (g: UpdateGoalInput) => {
		if (g.type === GoalType.B) return 'SELL ' + g.name;
		return getAnnotationContent(g);
	};

	const getAnnotationRunningYearContent = (g: UpdateGoalInput) => {
		if (g.type === GoalType.B) return 'MAINTAIN ' + g.name;
		return getAnnotationContent(g);
	};

  const generateTooltipContent = (startingGoalsContent: any, runningGoalsContent: any, endingGoalsContent: any) => {
    let startYear = goal ? wipGoal.sy : ffGoal.sy;
    let planDuration = goal ? wipGoal.loan?.dur : ffGoal.loan?.dur;
    let tt: any = {};
    for (let y = new Date().getFullYear(); y <= startYear + planDuration; y++) {
      let content = `Key Milestones in Year ${y}`;
      if (!startingGoalsContent.hasOwnProperty(y)
      && !runningGoalsContent.hasOwnProperty(y)
      && !endingGoalsContent.hasOwnProperty(y)) {
        content+= '\n\nNo Goal defined.\n';
        continue;
      }
      if (startingGoalsContent[y]) {
        content+= `\n\n\u27A3 Goals Starting:\n${startingGoalsContent[y]}`;
      }
      if (runningGoalsContent[y]) {
        content+= `\n\n\u27A2 Goals On-going:\n${runningGoalsContent[y]}`;
      }
      if (endingGoalsContent[y]) {
        content+= `\n\n\u27A4 Goals Ending:\n${endingGoalsContent[y]}`
      }
      tt[y] = content;
    }
    return tt;
  };

	return (
    lineAnnotations.length ?
      <BasicLineChart chartTitle="Yearly Porfolio Forecast with Milestones" dataMarkers={dataMarkers} tooltips={tooltips} lineAnnotations={lineAnnotations} />
    : <Skeleton active />
  );
}
