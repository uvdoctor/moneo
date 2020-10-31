import { Col, Row } from 'antd';
import React, { ReactNode, useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';

interface TabContentProps {
	result?: boolean;
}

export default function TabContent({ result }: TabContentProps) {
	const { inputTabIndex, resultTabIndex, inputTabs, resultTabs }: any = useContext(CalcContext);
	const tabs = result ? resultTabs : inputTabs;
	const currentIndex = result ? resultTabIndex : inputTabIndex;

	return (
		<Col span={24}
			style={{ margin: !result ? '1rem' : ''}}
		>
			{tabs[currentIndex].content instanceof Array ? (
				<Row>
					{tabs[currentIndex].content.map(
						(tabContent: ReactNode, i: number) =>
							tabContent ? (
								<Col key={'tc' + i} offset={2}>
									{tabContent}
								</Col>
							) : null
					)}
				</Row>
			) : tabs[currentIndex].content ? (
				tabs[currentIndex].content
			) : null}
		</Col>
	);
}
