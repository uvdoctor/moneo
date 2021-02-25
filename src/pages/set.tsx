import { withAuthenticator } from '@aws-amplify/ui-react';
import React, { useState } from 'react';
import SetPlan from '../components/goals/SetPlan';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import { CreateGoalInput } from '../api/goals';
import { PlanContextProvider } from '../components/goals/PlanContext';

Amplify.configure(awsmobile);

const Set = () => {
  const [wipGoal, setWIPGoal] = useState<CreateGoalInput | null>(null);
  
	return (
		<PlanContextProvider goal={wipGoal} setGoal={setWIPGoal}>
			<SetPlan />
		</PlanContextProvider>
	);
};

export default withAuthenticator(Set);
