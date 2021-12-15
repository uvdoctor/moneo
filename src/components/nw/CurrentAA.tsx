import { Badge, Col, Empty, Row, Skeleton, Tooltip } from 'antd';
import dynamic from 'next/dynamic';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AssetSubType, AssetType, InstrumentInput, MCap, MFSchemeType } from '../../api/goals';
import { ASSET_TYPES, COLORS } from '../../CONSTANTS';
import { AppContext } from '../AppContext';
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
		totalAlternative,
		totalLendings,
		totalFGold,
		totalPGold,
		totalFRE,
		totalFInv,
		totalProperties,
		selectedCurrency,
		loadingHoldings,
		totalAssets,
		instruments,
		totalAngel,
		totalFFixed,
		totalNPSFixed,
		totalOthers,
		totalVehicles,
		totalPF,
		totalOtherProperty,
		totalCommercial,
		totalResidential,
		totalPlot,
		totalEPF,
		totalVPF,
		totalPPF,
		totalNPSEquity,
		totalCrypto
	}: any = useContext(NWContext);
	const { insData }: any = useContext(AppContext);
	const [ totalCash, setTotalCash ] = useState<number>(totalSavings + totalDeposits + totalLendings);
	const [ data, setData ] = useState<Array<any>>([]);
	const [ largeCap, setLargeCap ] = useState<number>(0);
	const [ midCap, setMidCap ] = useState<number>(0);
	const [ smallCap, setSmallCap ] = useState<number>(0);
	const [ hybridCap, setHybridCap ] = useState<number>(0);
	const [ fmp, setFmp ] = useState<number>(0);
	const [ bonds, setBonds ] = useState<number>(0);
	const [ intervalFunds, setIntervalFunds ] = useState<number>(0);
	const [ indexFunds, setIndexFunds ] = useState<number>(0);
	const [ liquidFunds, setLiquidFunds ] = useState<number>(0);
	const categories: any = {
		Equity: { color: COLORS.ORANGE, total: totalEquity },
		Fixed: { color: COLORS.BLUE, total: totalFFixed + totalNPSFixed },
		'Real-estate': { color: '#7cd9fd', total: totalProperties },
		'Real Estate Investment Trusts': { color: '#7cd9fd', total: totalFRE },
		'Other Investment Trusts': { color: COLORS.SILVER, total: totalFInv },
		Gold: { color: '#f6e05e', total: totalFGold + totalPGold },
		Others: { color: '#aa8dfa', total: totalAlternative - totalFGold - totalPGold - totalProperties - totalFRE - totalCrypto - totalFInv },
		Crypto: { color: COLORS.RED, total: totalCrypto }
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
				value: categories[cat].total / totalAssets * 100
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
	},[ totalAssets ]);

	useEffect(
		() => {
			let largeCap = 0;
			let midCap = 0;
			let smallCap = 0;
			let hybridCap = 0;
			let fmp = 0;
			let bonds = 0;
			let intervalFunds = 0;
			let indexFunds = 0;
			let liquidFunds = 0;
			instruments.map((instrument: InstrumentInput) => {
				const data = insData[instrument.id];
				if(data){
					const price = instrument.qty * (data ? data.price : 0);
					if (data.type === AssetType.E) {
						if (data.meta) {
							if (data.meta.mcap === MCap.L) largeCap += price;
							if (data.meta.mcap === MCap.M) midCap += price;
							if (data.meta.mcap === MCap.S) smallCap += price;
							if (data.meta.mcap === MCap.H) hybridCap += price;
							else smallCap += price;
						}
						if (data.mcap === MCap.L) largeCap += price;
						if (data.mcap === MCap.M) midCap += price;
						if (data.mcap === MCap.S) smallCap += price;
						if (data.mcap === MCap.H) hybridCap += price;
					}
					if (data.type === AssetType.F) {
						if (data.subt === AssetSubType.CB || data.subt === AssetSubType.GB || data.subt === AssetSubType.GBO || data.subt === AssetSubType.HB) bonds += price;
						if (data.subt === AssetSubType.I) indexFunds += price;
						if (data.subt === AssetSubType.L) liquidFunds += price;
						if (data.mftype && data.subt === AssetSubType.HB) {
							if(data.mftype === MFSchemeType.I) intervalFunds += price;
							if(data.mftype === MFSchemeType.C) fmp += price;
						} 
					}
				}
			});
			setLargeCap(largeCap);
			setMidCap(midCap);
			setSmallCap(smallCap);
			setHybridCap(hybridCap);
			setIndexFunds(indexFunds);
			setLiquidFunds(liquidFunds);
			setBonds(bonds);
			setIntervalFunds(intervalFunds);
			setFmp(fmp);
		},
		[ instruments ]
	);

	const pattern = (records: Array<any>) => {
		let data: any = '';
		let doesValueExist: boolean = false;
		records.map((record) => { 
			const amount = toHumanFriendlyCurrency(record.value, selectedCurrency);
			const percentage = toReadableNumber(record.value / totalAssets * 100, 2);
			if(record.value) {
				doesValueExist = (true);
				data += `<strong>${amount}</strong>(${percentage}%) of ${record.desc}<br/><br/>`;
			}
		});
		return doesValueExist ? `<br/><br/>Includes<br/><br/>${data}` : '';
	};

	const breakdownAssetInfo = (asset: string) => {
		if (asset === 'Gold')
			return pattern([ { value: totalPGold, desc: 'Physical Gold' }, { value: totalFGold, desc: 'Gold Bonds' } ]);
		if (asset === 'Equity')
			return pattern([
				{ value: largeCap + totalNPSEquity, desc: ASSET_TYPES.LARGE_CAP_STOCKS },
				{ value: midCap, desc: ASSET_TYPES.MID_CAP_STOCKS },
				{ value: smallCap, desc: ASSET_TYPES.SMALL_CAP_STOCKS },
				{ value: hybridCap, desc: 'Funds spread across Large, Mid and Small Cap Stocks' },
				{ value: totalAngel, desc: 'Angel Investment' },
			]);
		if (asset === 'Fixed')
			return pattern([
				{ value: fmp, desc: 'Fixed Maturity Plan' },
				{ value: intervalFunds, desc: 'Interval Funds' },
				{ value: bonds, desc: 'Bonds'},
				{ value: indexFunds, desc: 'Index Funds' },
				{ value: liquidFunds, desc: 'Liquid Funds' },
			]);
		if (asset === 'Real-estate')
			return pattern([
				{ value: totalCommercial, desc: 'Commercial' },
				{ value: totalResidential, desc: 'Residential' },
				{ value: totalPlot, desc: 'Plot' },
				{ value: totalOtherProperty, desc: 'Other' },
			]);
		if (asset === 'Others')
			return pattern([ { value: totalOthers, desc: 'Others' }, { value: totalVehicles, desc: 'Vehicles' } ]);
		if (asset === 'PF')
			return (<>Includes<br/><br/>
				<strong>${toHumanFriendlyCurrency(totalPPF, selectedCurrency)}</strong>
				({toReadableNumber(totalPPF / totalAssets * 100, 2)}%) of Pension PF<br/><br/>
				<strong>${toHumanFriendlyCurrency(totalVPF, selectedCurrency)}</strong>
				({toReadableNumber(totalVPF / totalAssets * 100, 2)}%) of Voluntary PF<br/><br/>
				<strong>${toHumanFriendlyCurrency(totalEPF, selectedCurrency)}</strong>
				({toReadableNumber(totalEPF / totalAssets * 100, 2)}%) of Employee PF<br/><br/>
			</> );
		return '';
	};

	return !loadingHoldings ? totalAssets ? (
		<Fragment>
			<p>Total Asset Allocation of {toHumanFriendlyCurrency(totalAssets, selectedCurrency)}</p>
			<Row>
				<Col xs={24} sm={8}>
					<div className="cash deposits">
						Deposits <Badge count={`${toReadableNumber(totalLendings / totalAssets * 100, 2)} %`} />
						<strong>{toHumanFriendlyCurrency(totalLendings, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={8}>
					<div className="cash">
						Savings <Badge count={`${toReadableNumber(totalSavings / totalAssets * 100, 2)} %`} />
						<strong>{toHumanFriendlyCurrency(totalSavings, selectedCurrency)}</strong>
					</div>
				</Col>
				<Col xs={24} sm={8}>
					<Tooltip title={breakdownAssetInfo('PF')}>
						<div className="cash deposits">
							Provident Fund <Badge count={`${toReadableNumber(totalPF / totalAssets * 100, 2)} %`} />
							<strong>{toHumanFriendlyCurrency(totalPF, selectedCurrency)}</strong>
						</div>
					</Tooltip>
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
							)}</strong> (${toReadableNumber(
								value,
								2
							)}%)${breakdownAssetInfo(name)}`
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
		</Fragment>
	) : (
		<Empty />
	) : (
		<Skeleton active />
	);
}
