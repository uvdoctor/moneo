import { Badge, Col, Empty, Row, Skeleton } from 'antd';
import dynamic from 'next/dynamic';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { COLORS } from '../../CONSTANTS';
import { toHumanFriendlyCurrency, toReadableNumber } from '../utils';
import { NWContext } from './NWContext';

const TreemapChart = dynamic(() => import('bizcharts/lib/plots/TreemapChart'), {
	ssr: false
});

export default function CurrentAA() {
	const {
		totalSavings,
		totalDeposits,
		totalEquity,
		totalFixed,
		totalAlternative,
		totalLendings,
		totalFGold,
		totalPGold,
		totalFRE,
        totalPPF,
        totalEPF,
		totalVPF,
		totalProperties,
		selectedCurrency,
		loadingHoldings,
		totalAssets
	}: any = useContext(NWContext);
	const [ totalCash, setTotalCash ] = useState<number>(totalSavings + totalDeposits + totalLendings);
	const [ data, setData ] = useState<Array<any>>([]);
	const categories: any = {
		Equity: { color: COLORS.ORANGE, total: totalEquity },
		Fixed: { color: COLORS.BLUE, total: totalFixed + totalPPF + totalEPF + totalVPF },
		'Real-estate': { color: '#7cd9fd', total: totalFRE + totalProperties },
		Gold: { color: '#f6e05e', total: totalFGold + totalPGold },
		Others: { color: '#aa8dfa', total: totalAlternative - totalFGold - totalPGold - totalProperties - totalFRE	}
	};

	const initChartData = () => {
		if (!totalAssets) {
			setData([ ...[] ]);
			return;
		}
		let data: Array<any> = [];
		Object.keys(categories).forEach((cat) => {
			data.push({
				name: cat,
				value: (categories[cat].total / totalAssets) * 100,
			});
		});
		setData([ ...data ]);
	};

	useEffect(
		() => {
			setTotalCash(totalSavings + totalDeposits + totalLendings);
		},
		[ totalSavings, totalDeposits, totalLendings ]
	);

    useEffect(() => {
        initChartData();
    }, [totalAssets]);

	return !loadingHoldings ? (
		totalAssets ? <Fragment>
			<p>Total Asset Allocation of {toHumanFriendlyCurrency(totalAssets, selectedCurrency)}</p>
			<Row>
				<Col xs={24} sm={8}>
					<div className="cash deposits">
						Deposits <Badge count={`${toReadableNumber(totalDeposits / totalAssets*100,2)} %`} />
						<strong>{toHumanFriendlyCurrency(totalDeposits, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={8}>
					<div className="cash deposits">
						Lent <Badge count={`${toReadableNumber(totalLendings / totalAssets*100,2)} %`} />
						<strong>{toHumanFriendlyCurrency(totalLendings, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={8}>
					<div className="cash">
						Savings <Badge count={`${toReadableNumber(totalSavings / totalAssets*100, 2)} %`} />
						<strong>{toHumanFriendlyCurrency(totalSavings, selectedCurrency)}</strong>
					</div>
				</Col>
			</Row>
			<TreemapChart
				data={{
					name: 'root',
					value: 100 - (totalAssets ? totalCash / totalAssets : 0),
					children: data
				}}
				meta={{
					value: {
						formatter: ({ v }: any) => toReadableNumber(v, 2) + '%'
					}
				}}
				label={{
					visible: true,
					formatter: (v: any) => {
						return v.name;
					},
					style: {
						fontFamily: "'Jost', sans-serif",
						fontSize: 14,
						fill: COLORS.DEFAULT
					}
				}}
				rectStyle={{ stroke: '#fff', lineWidth: 2 }}
				color={(asset: any) => categories[asset.name].color}
				autoFit
				tooltip={{
					visible: true,
					formatter: ({ name, value }: any) => {
						return {
							name,
							value: `<strong>${toHumanFriendlyCurrency(
								categories[name].total,
								selectedCurrency
							)}</strong> (${toReadableNumber(value, 2)}%)`
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
		</Fragment> : <Empty />
	) : (
		<Skeleton active />
	);
}
