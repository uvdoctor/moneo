import React, { useContext } from 'react';
import { PLAN_DURATION } from '../../CONSTANTS';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import SelectInput from '../form/selectinput';
import { changeSelection } from '../utils';

export default function FIGoalHeader() {
  const { addCallback, updateCallback, endYear, setEndYear, eyOptions }: any = useContext(CalcContext);
  
	return (
      <CalcHeader>
        {addCallback && updateCallback && (
          <SelectInput
          //info="Financial Plan will be created assuming that You live till 100 Years, after which You leave behind inheritance.
          //DollarDarwin will try to find the earliest possible year for Your Financial Independence based on Your inputs and Other Goals that You Create.
          //Given that You May not be able to work beyond 70 years of age, DollarDarwin may request You to reconsider Your inputs and other Goals so that You Achieve Financial Independence before hitting 70."
          pre="Birth Year"
          value={endYear - PLAN_DURATION}
          changeHandler={(val: string) => changeSelection(val, setEndYear, 100)}
          options={eyOptions}
        />
      )}
      </CalcHeader>
	);
}
