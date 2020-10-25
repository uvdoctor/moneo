import { Col } from 'antd';
import React, { ReactNode, useContext } from 'react';

interface TabContentProps {
	contextType: any;
	result?: boolean;
}

export default function TabContent({ contextType, result }: TabContentProps) {
	const { inputTabIndex, resultTabIndex, inputTabs, resultTabs }: any = useContext(contextType);
	const tabs = result ? resultTabs : inputTabs;
	const currentIndex = result ? resultTabIndex : inputTabIndex;

	return tabs[currentIndex].content instanceof Array ? (
		tabs[currentIndex].content.map(
			(tabContent: ReactNode, i: number) =>
				tabContent ? (
					<Col key={'tc' + i} span={24} style={{ background: 'white', maxWidth: '550px' }}>
						{tabContent}
					</Col>
				) : null
		)
	) : tabs[currentIndex].content ? (
		<Col span={24} style={{ background: 'white', maxWidth: '550px' }}>
			{tabs[currentIndex].content}
		</Col>
	) : null;
}
