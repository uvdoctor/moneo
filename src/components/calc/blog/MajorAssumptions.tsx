import { Collapse } from 'antd';
import React, { Fragment } from 'react';

interface MajorAssumptionsProps {
	assumptions: Array<any>;
}

export default function MajorAssumptions({ assumptions }: MajorAssumptionsProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{assumptions.map((result: any, i: number) => (
				<Collapse>
					<Panel header={result.title} key={'' + i}>
						{result.content}
					</Panel>
				</Collapse>
			))}
		</Fragment>
	);
}
