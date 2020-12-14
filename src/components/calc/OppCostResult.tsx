import React, { Fragment, useContext } from 'react';
import { GoalType } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { initOptions, toHumanFriendlyCurrency } from '../utils';
import { Row } from 'antd';

interface OppCostResultProps {
  oppCost: number;
  numOfYears: number;
  numOfYearsOptions: any;
  oppCostHandler: Function;
}

export default function OppCostResult({oppCost, numOfYears, numOfYearsOptions, oppCostHandler}: OppCostResultProps) {
  const drOptions = initOptions(1, 9);
  const { currency, goal, dr, setDR }: any = useContext(CalcContext);
  return (
    <ItemDisplay
    result={oppCost}
    currency={currency}
    label={
      <Fragment>
        {`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest`}
        {dr && (
          <Fragment>
            {` @ `}
            <SelectInput
              pre=""
              value={Math.round(dr)}
              changeHandler={(val: string) => setDR(parseInt(val))}
              post="%"
              options={drOptions}
            />
          </Fragment>
        )}
      </Fragment>
    }
    svg={oppCost < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
    pl
    unit={
      <Row align="middle">
        {`in `}
        {goal.type !== GoalType.FF && (
          <SelectInput
            pre=""
            value={numOfYears}
            unit="Years"
            options={numOfYearsOptions}
            changeHandler={(val: string) => oppCostHandler(parseInt(val))}
          />
        )}
      </Row>
    }
    info={`You ${oppCost < 0 ? 'Lose' : 'Gain'} about ${toHumanFriendlyCurrency(Math.abs(oppCost), currency)} in ${numOfYears} Years
    by ${goal.type === GoalType.B ? 'Buying' : 'Spending'} instead of Investing${dr ? `, given that Investment earns ${dr}% Yearly` : ''}.`}
  />
  )
}