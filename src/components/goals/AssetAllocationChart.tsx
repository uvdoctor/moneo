import React, { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { List, Badge, Row, Col } from 'antd';
import {
	getAllAssetCategories,
	getAllAssetTypesByCategory,
	getAssetColour,
	initOptions,
	isMobileDevice,
	toHumanFriendlyCurrency
} from '../utils';
import { CalcContext } from '../calc/CalcContext';
import DataSwitcher from '../DataSwitcher';
import { ASSET_CATEGORIES, COLORS } from '../../CONSTANTS';
import { useFullScreenBrowser } from 'react-browser-hooks';
import SelectInput from '../form/selectinput';
import { FIGoalContext } from './FIGoalContext';

const TreemapChart = dynamic(() => import('bizcharts/lib/plots/TreemapChart'), {
	ssr: false
});

interface RenderItemProp {
	name?: any;
	value?: any;
}

interface CashDataKeys {
	[key: string]: any;
}

interface CashData extends CashDataKeys {
	value: number;
	deposits: number;
	savings: number;
}

interface AssetAllocationChartProps {
	yearChangeable?: boolean;
}

export default function AssetAllocationChart({ yearChangeable }: AssetAllocationChartProps) {
	const cashDataDefault = {
		value: 0,
		deposits: 0,
		savings: 0
	};
	const nowYear = new Date().getFullYear();
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const { cfs, currency, startYear }: any = useContext(CalcContext);
	const { planDuration, wipResult }: any = useContext(FIGoalContext);
	const [ index, setIndex ] = useState<number>(yearChangeable ? 1 : 0);
	const [ data, setData ] = useState<Array<any>>([]);
	const [ cashData, setCashData ] = useState<CashData>(cashDataDefault);
	const ffGoalEndYear = startYear + planDuration;
	const [ aaYearOptions, setAAYearOptions ] = useState<any>(initOptions(nowYear + 1, ffGoalEndYear - nowYear - 2));
	const fsb = useFullScreenBrowser();

	const getFormattedAssetName = (assetName: string) => {
		if (isMobileDevice(fsb) && (assetName.endsWith('nds') || assetName.endsWith('cks'))) {
			let result = '';
			let strings = assetName.split(' ');
			strings.forEach((str) => (result += str + '\n'));
			return result;
		} else return assetName + '\n';
	};

	const initChartData = () => {
		let data: Array<any> = [];
		const aa = wipResult.aa;
		const cash: CashData = cashDataDefault;

		getAllAssetCategories().forEach((cat) => {
			let children: Array<any> = [];
			let total = 0;
			getAllAssetTypesByCategory(cat).forEach((at) => {
				if (aa[at][index]) {
					total += aa[at][index];
					cat === ASSET_CATEGORIES.CASH
						? (cash[at.toLowerCase()] = aa[at][index])
						: children.push({
								name: at,
								value: aa[at][index],
								children: []
							});
				}
			});

			if (total)
				cat === ASSET_CATEGORIES.CASH
					? (cash.value = total)
					: data.push({
							name: cat,
							value: total,
							children: children
						});
		});
		setCashData(cash);
		setData([ ...data ]);
	};

	useEffect(
		() => {
			const ffGoalEndYear = startYear + planDuration;
			setAAYearOptions(initOptions(nowYear + 1, ffGoalEndYear - nowYear - 2));
		},
		[ startYear, planDuration ]
	);

	useEffect(
		() => {
			if (cfs.length) initChartData();
		},
		[ cfs, index ]
	);

	return (
		<Fragment>
			<DataSwitcher
				title={
					<Fragment>
						Target Asset Allocation of <strong>{toHumanFriendlyCurrency(cfs[index], currency)}</strong> for
						end of Year&nbsp;
						{yearChangeable ? (
							<SelectInput
								pre=""
								value={nowYear + index}
								changeHandler={(val: string) => setIndex(parseInt(val) - nowYear)}
								options={aaYearOptions}
							/>
						) : (
							<strong>{nowYear + index}</strong>
						)}
					</Fragment>
				}
				header={
					cashData ? (
						<Fragment>
							<Row>
								<Col xs={24} lg={8}>
									<div className="cash active">
										<span className="arrow-right" />
										Cash <Badge count={`${cashData.value} %`} />
										<strong>
											{toHumanFriendlyCurrency(
												Math.round(cfs[index] * cashData.value / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
								<Col xs={24} sm={12} lg={8}>
									<div className="cash deposits">
										Deposits <Badge count={`${cashData.deposits} %`} />
										<strong>
											{toHumanFriendlyCurrency(
												Math.round(cfs[index] * cashData.deposits / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
								<Col xs={24} sm={12} lg={8}>
									<div className="cash">
										Savings <Badge count={`${cashData.savings} %`} />
										<strong>
											{toHumanFriendlyCurrency(
												Math.round(cfs[index] * cashData.savings / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
							</Row>
						</Fragment>
					) : null
				}
			>
				<Chart>
					{cashData.value === 100 ? (
						<Row justify="center">
							<Col>
								<strong>No further allocation possible as Cash Allocation is 100%</strong>
							</Col>
						</Row>
					) : (
						<TreemapChart
							data={{
								name: 'root',
								value: 100 - (cashData.value || 0),
								children: data
							}}
							meta={{
								value: {
									formatter: ({ v }: any) => v + '%'
								}
							}}
							label={{
								visible: true,
								formatter: (v: any) =>
									wipResult.aa.hasOwnProperty(v.name)
										? `${getFormattedAssetName(v.name)}${wipResult.aa[v.name][index]}%`
										: v.name,
								style: {
									fontFamily: "'Jost', sans-serif",
									fontSize: 14,
									fill: COLORS.DEFAULT
								}
							}}
							rectStyle={{ stroke: '#fff', lineWidth: 2 }}
							color={(asset: any) => getAssetColour(asset.name)}
							autoFit
							tooltip={{
								visible: true,
								formatter: ({ name, value }: any) => {
									return {
										name,
										value: `<strong>${toHumanFriendlyCurrency(
											Math.round(cfs[index] * value / 100),
											currency
										)}</strong> (${value}%)`
									};
								}
							}}
							interactions={[
								{
									type: 'zoom',
									enable: false
								}
							]}
						/>
					)}
				</Chart>
				<DataSwitcherList>
					<List
						dataSource={data}
						renderItem={({ name, value, children }) => {
							const [ title ] = name.split(' ');

							return (
								<Fragment>
									<List.Item
										className="heading"
										actions={[
											toHumanFriendlyCurrency(Math.round(cfs[index] * value / 100), currency),
											<Badge count={`${value}%`} />
										]}
									>
										{title}
									</List.Item>
									<List.Item>
										<List
											dataSource={children}
											renderItem={({ name, value }: RenderItemProp) => {
												const assetColor = getAssetColour(name);

												return (
													<List.Item
														actions={[
															toHumanFriendlyCurrency(
																Math.round(cfs[index] * value / 100),
																currency
															),
															<Badge count={`${value}%`} />
														]}
													>
														<span style={{ background: assetColor }} />
														{name}
													</List.Item>
												);
											}}
										/>
									</List.Item>
								</Fragment>
							);
						}}
					/>
				</DataSwitcherList>
			</DataSwitcher>
		</Fragment>
	);
}
