import { Col } from 'antd';
import React, { ReactNode, useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';

interface TabContentProps {
	result?: boolean;
}

export default function TabContent({ result }: TabContentProps) {
	const { inputTabIndex, resultTabIndex, inputTabs, resultTabs }: any = useContext(CalcContext);
	const tabs = result ? resultTabs : inputTabs;
	const currentIndex = result ? resultTabIndex : inputTabIndex;
	
	return tabs[currentIndex].content instanceof Array ? (
		tabs[currentIndex].content.map(
			(tabContent: ReactNode, i: number) =>
				tabContent ? (
					<Col key={'tc' + i} style={{ maxWidth: !result ? '550px' : '' }}>
						{tabContent}
					</Col>
				) : null
		)
	) : tabs[currentIndex].content ? (
		<Col style={{ maxWidth: !result ? '550px' : ''}}>
			{tabs[currentIndex].content}
		</Col>
	) : null;
}
