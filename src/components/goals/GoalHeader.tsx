import { Col, PageHeader, Row } from 'antd';
import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';
import { getGoalTypes, getImpLevels } from './goalutils';

export default function GoalHeader() {
  const typesList: any = getGoalTypes();
  const { goal, name, setName, impLevel, setImpLevel, addCallback, updateCallback, currency, changeCurrency }: any = useContext(GoalContext);
  return (
    addCallback && updateCallback ?
      <Row align="middle" justify="space-between" style={{marginTop: '1rem', marginBottom: '1rem'}}>
          <Col span={11}>
            <TextInput
              name="name"
              pre={typesList[goal.type]}
              placeholder="Goal Name"
              value={name}
              changeHandler={setName}
              width="150px"
            />
          </Col>
          <Col span={11}>
            <SelectInput
              pre="Importance"
              value={impLevel}
              changeHandler={setImpLevel}
              options={getImpLevels()}
            />
          </Col>
          </Row>
    : <PageHeader
        className="calculator-header"
        title={goal.name + ' Calculator'}
        extra={[<SelectInput pre="" value={currency} changeHandler={changeCurrency} currency />]}
      />
	);
}
