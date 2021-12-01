import React, { Fragment } from 'react';

interface TabInfoProps {
	infoData: string;
	link: string;
}

export default function TabInfo({ infoData, link }: TabInfoProps) {
	return (
		<Fragment>
			{infoData}
			<a href={link} rel="noreferrer">
				link
			</a>
		</Fragment>
	);
}
