import React, { Fragment } from 'react';

interface TabInfoProps {
	info: string;
	link: string;
}

export default function TabInfo({ info, link }: TabInfoProps) {
	return (
		<Fragment>
			{info}&nbsp;&nbsp;
			<a href={link} rel="noreferrer">
				Read more
			</a>
		</Fragment>
	);
}
