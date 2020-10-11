import React, { Fragment, ReactNode, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import SVGFullScreen from '../svgfullscreen';
import SVGExitFullScreen from '../svgexitfullscreen';
import DynamicSlider from '../dynamicslider';
import { Tabs } from 'antd';

interface ResultProps {
	result: ReactNode;
	resultTabOptions: Array<any>;
	showResultTab: string;
	children: ReactNode;
	showResultTabHandler: Function;
}

export default function Result(props: ResultProps) {
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div ref={chartDiv} className={`w-full transition-width duration-1000 ease-in-out`}>
			<Fragment>
				{props.result}
				<div className="flex w-full items-center mt-2 mb-2">
					<div className="ml-1 mr-4 cursor-pointer" onClick={toggle}>
						{!fullScreen ? <SVGFullScreen /> : <SVGExitFullScreen />}
					</div>
					<div className="w-full">
						<Tabs
							onTabClick={(e: any) => props.showResultTabHandler(e.key)}
							defaultActiveKey={props.resultTabOptions[0].label}
						>
							{props.resultTabOptions.map((tab) => (
								<TabPane
									key={tab.label}
									disabled={!tab.active}
									tab={
										<span>
											<tab.svg disabled={!tab.active} selected={props.showResultTab === tab.label} />
											{tab.label}
										</span>
									}
								/>
							))}
						</Tabs>
					</div>
				</div>
				<DynamicSlider
					setSlide={props.showResultTabHandler}
					totalItems={props.resultTabOptions}
					currentItem={props.showResultTab}
				>
					{React.Children.map(props.children, (child: any) => (child ? child : null))}
				</DynamicSlider>
			</Fragment>
		</div>
	);
}
