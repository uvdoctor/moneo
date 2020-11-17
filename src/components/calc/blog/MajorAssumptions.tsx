import { Collapse } from 'antd';
import React, { Fragment } from 'react';
import { BlogInputProps } from '../Layout';

export default function MajorAssumptions({ elements }: BlogInputProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{elements.map((result: any, i: number) => (
				result ? <Collapse defaultActiveKey={['0']}>
					<Panel header={result.title} key={'' + i}>
						{result.content}
					</Panel>
				</Collapse> : null
			))}
		</Fragment>
	);
}
