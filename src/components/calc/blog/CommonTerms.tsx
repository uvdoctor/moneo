import { Collapse } from 'antd';
import React, { Fragment } from 'react';
import { BlogInputProps } from '../Layout';

export default function CommonTerms({ elements }: BlogInputProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{elements.map((result: any, i: number) => (
				result ? <Collapse>
					<Panel header={result.title} key={'' + i}>
						{result.content}
					</Panel>
				</Collapse> : null
			))}
		</Fragment>
	);
}
