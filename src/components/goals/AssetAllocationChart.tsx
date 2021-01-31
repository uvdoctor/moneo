import React, { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { List, Badge, Row, Col, Button } from 'antd';
import {
	getAllAssetCategories,
	getAllAssetTypesByCategory,
	getAssetColour,
	toHumanFriendlyCurrency
} from '../utils';
import { CalcContext } from '../calc/CalcContext';
import DataSwitcher from '../DataSwitcher';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ASSET_CATEGORIES } from '../../CONSTANTS';

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
	year?: number;
	backFunction?: Function;
}

export default function AssetAllocationChart({
	year = new Date().getFullYear(),
	backFunction
}: AssetAllocationChartProps) {
	const cashDataDefault = {
		value: 0,
		deposits: 0,
		savings: 0
	};
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const { cfs, ffResult, currency, rr }: any = useContext(CalcContext);
	const index = year - new Date().getFullYear();
	const [ data, setData ] = useState<Array<any>>([]);
	const [ colors, setColors ] = useState<Array<string>>([]);
	const [ cashData, setCashData ] = useState<CashData>(cashDataDefault);

	const sortDesc = (data: Array<any>) => data.sort((a, b) => b.value - a.value);

	const getAssetShortName = (assetName: string) => {
		if (assetName.endsWith('nds') || assetName.endsWith('cks')) {
			let result = '';
			let strings = assetName.substr(0, assetName.length - (assetName.endsWith('cks') ? 7 : 6)).split(' ');
			strings.forEach((str) => (result += str + '\n'));
			return result;
		} else return assetName + '\n';
	};

	const initChartData = () => {
		let data: Array<any> = [];
		let colors: Array<string> = [];
		const aa = ffResult.aa;
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

			cat === ASSET_CATEGORIES.CASH
				? (cash.value = total)
				: data.push({
						name: cat,
						value: total,
						children: children
					});
		});
		setCashData(cash);
		sortDesc(data).forEach((cat) => colors.push(getAssetColour(cat.name)));
		data.forEach((cat) => {
			sortDesc(cat.children).forEach((at) => colors.push(getAssetColour(at.name)));
			cat.name += ` ${cat.value}%`;
		});
		setData([ ...data ]);
		setColors([ ...colors ]);
	};

	useEffect(
		() => {
			if (rr.length) initChartData();
		},
		[ rr ]
	);

	return (
		<Fragment>
			<DataSwitcher
				title={
					<Fragment>
						{backFunction && (
							<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => backFunction()} />
						)}
						Target Asset Allocation of <strong>{toHumanFriendlyCurrency(cfs[index], currency)}</strong> for
						end of Year {' '}<strong>{year}</strong>
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
					<TreemapChart
						data={{
							name: 'Portfolio',
							value: 100 - (cashData.value || 0),
							children: data
						}}
						meta={{
							value: {
								formatter: (v) => {
									return v + '%';
								}
							}
						}}
						colorField="name"
						label={{
							visible: true,
							formatter: (v) => {
								return ffResult.aa.hasOwnProperty(v)
									? `${getAssetShortName(v)}${ffResult.aa[v][index]}%`
									: v;
							},
							style: {
								fontSize: 14,
								fill: 'grey'
							}
						}}
						color={colors}
						rectStyle={{ stroke: '#fff', lineWidth: 2 }}
						forceFit
						tooltip={{
							visible: true,
							//@ts-ignore
							formatter: (name, value) => {
								return {
									name,
									value: `<strong>${toHumanFriendlyCurrency(
										Math.round(cfs[index] * value / 100),
										currency
									)}</strong> (${value}%)`
								};
							}
						}}
					/>
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
