import React, { useContext } from 'react';
import { PLAN_DURATION } from '../../CONSTANTS';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import SelectInput from '../form/selectinput';
import { changeSelection } from '../utils';

export default function FIGoalHeader() {
  const { endYear, setEndYear, eyOptions }: any = useContext(CalcContext);
  
	return (
      <CalcHeader>
          <SelectInput
          info="DollarDarwin will try to find the earliest possible year for Your Financial Independence (FI) assuming that 70 is the latest age by which You need to achieve FI. DollarDarwin may request You to reconsider Your inputs in case FI is not achievable by 70."
          pre="Birth Year"
          value={endYear - PLAN_DURATION}
          changeHandler={(val: string) => changeSelection(val, setEndYear, 100)}
          options={eyOptions}
        />
      </CalcHeader>
	);
}
