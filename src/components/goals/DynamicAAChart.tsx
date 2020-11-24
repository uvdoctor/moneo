import React, { Fragment, useState } from 'react';
import AAPlanChart from './AAPlanChart';
import AssetAllocationChart from './AssetAllocationChart';

export default function DynamicAAChart() {
	const [ showSingleYear, setShowSingleYear ] = useState<number | null>(null);

  const showAAPlan = () => setShowSingleYear(null);

	return (
		<Fragment>
			{!showSingleYear ? (
				<AAPlanChart changeToSingleYear={setShowSingleYear} />
			) : (
          <AssetAllocationChart year={showSingleYear} backFunction={showAAPlan} />
			)}
		</Fragment>
	);
}
