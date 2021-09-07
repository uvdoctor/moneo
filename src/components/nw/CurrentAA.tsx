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
		totalAngel,
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
		loadingHoldings
	}: any = useContext(NWContext);
	const [ totalCash, setTotalCash ] = useState<number>(totalSavings + totalDeposits + totalLendings);
	const [ total, setTotal ] = useState<number>(totalCash + totalFixed + totalEquity + totalAngel + totalAlternative + totalPPF + totalEPF + totalVPF);
	const [ data, setData ] = useState<Array<any>>([]);
	const categories: any = {
		Equity: { color: COLORS.ORANGE, total: totalEquity + totalAngel },
		Fixed: { color: COLORS.BLUE, total: totalFixed + totalPPF + totalEPF + totalVPF },
		'Real-estate': { color: '#7cd9fd', total: totalFRE + totalProperties },
		Gold: { color: '#f6e05e', total: totalFGold + totalPGold },
		Others: { color: '#aa8dfa', total: totalAlternative - totalFGold - totalPGold - totalProperties - totalFRE	}
	};

	const initChartData = () => {
		if (!total) {
			setData([ ...[] ]);
			return;
		}
		let data: Array<any> = [];
		Object.keys(categories).forEach((cat) => {
			data.push({
				name: cat,
				value: (categories[cat].total / total) * 100,
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
    }, [total]);

	useEffect(
		() => {
			setTotal(totalCash + totalEquity + totalFixed + totalAngel + totalAlternative + totalPPF + totalEPF + totalVPF);
		},
		[ totalCash, totalEquity, totalFixed, totalAngel, totalAlternative, totalPPF, totalEPF, totalVPF ]
	);

	return !loadingHoldings ? (
		total ? <Fragment>
			<Row>
				<Col xs={24} lg={6}>
					<div className="cash active">
						<span className="arrow-right" />
						Cash <Badge count={`${total ? totalCash / total : 0} %`} />
						<strong>{toHumanFriendlyCurrency(totalCash, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<div className="cash deposits">
						Deposits <Badge count={`${total ? totalDeposits / total : 0} %`} />
						<strong>{toHumanFriendlyCurrency(totalDeposits, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<div className="cash deposits">
						Lent <Badge count={`${total ? totalLendings / total : 0} %`} />
						<strong>{toHumanFriendlyCurrency(totalLendings, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<div className="cash">
						Savings <Badge count={`${total ? totalSavings / total : 0} %`} />
						<strong>{toHumanFriendlyCurrency(totalSavings, selectedCurrency)}</strong>
					</div>
				</Col>
			</Row>
			<TreemapChart
				data={{
					name: 'root',
					value: 100 - (total ? totalCash / total : 0),
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
