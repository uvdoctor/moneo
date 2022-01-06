import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Button, Upload, Drawer, Tabs, Row, Badge, Col, Alert, Empty, Spin } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useFullScreenBrowser } from 'react-browser-hooks';
import HoldingsTable from './HoldingsTable';
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from '../AppContext';
import { NWContext } from './NWContext';
import { extractISIN, getUploaderSettings } from './parseutils';
import { isMobileDevice } from '../utils';
import simpleStorage from 'simplestorage.js';
import { AssetSubType, AssetType, InstrumentInput, InsType } from '../../api/goals';
import { UserOutlined } from '@ant-design/icons';
import { extractPAN, getQty } from './parseutils';
import { includesAny } from '../utils';
import {
	addMemberIfNeeded,
	getFamilyOptions,
	isBond,
	isFund,
	loadMatchingINBond,
	loadMatchingINExchange,
	loadMatchingINMutual
} from './nwutils';
import SelectInput from '../form/selectinput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import HSwitch from '../HSwitch';

export default function UploadHoldings() {
	const {
		showInsUpload,
		setShowInsUpload,
		instruments,
		setInstruments,
		allFamily,
		setAllFamily,
		currencyList,
		setCurrencyList,
		setSelectedCurrency,
		selectedCurrency,
		setSelectedMembers,
	}: any = useContext(NWContext);
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;
	const [ equities, setEquities ] = useState<any>({});
	const [ bonds, setBonds ] = useState<any>({});
	const [ mfs, setMFs ] = useState<any>({});
	const [ etfs, setETFs ] = useState<any>({});
	const [ gbs, setGBs ] = useState<any>({});
	const [ reits, setREITs ] = useState<any>({});
	const [ otherIts, setOtherIts ] = useState<any>({});
	const [ equitiesNum, setEquitiesNum ] = useState<number>(0);
	const [ bondsNum, setBondsNum ] = useState<number>(0);
	const [ etfsNum, setETFsNum ] = useState<number>(0);
	const [ gbsNum, setGBsNum ] = useState<number>(0);
	const [ reitsNum, setREITsNum ] = useState<number>(0);
	const [ otherItsNum, setOtherItsNum ] = useState<number>(0);
	const [ mfsNum, setMFsNum ] = useState<number>(0);
	const { Dragger } = Upload;
	const [ showDrawer, setDrawerVisibility ] = useState(false);
	const [ processing, setProcessing ] = useState<boolean>(false);
	const [ taxId, setTaxId ] = useState<string | null>(null);
	const [ memberKey, setMemberKey ] = useState<string | null>(null);
	const [ error, setError ] = useState<string>('');
	const [ overwrite, setOverwrite ] = useState<number>(1);
	const [ uploadedInstruments, setUploadedInstruments ] = useState<Array<any>>([]);
	const [ loading, setLoading ] = useState<boolean>(false);

	const onShowDrawer = () => setDrawerVisibility(true);

	const resetState = () => {
		setTaxId(null);
		setMemberKey(null);
		setError('');
		setProcessing(false);
		setShowInsUpload(false);
		setDrawerVisibility(false);
		setOverwrite(1);
		setUploadedInstruments([...[]]);
	};

	const allocateInstruments = () => {
		if(!uploadedInstruments || !uploadedInstruments.length) return;
		let insData: any = simpleStorage.get(LOCAL_INS_DATA_KEY);
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
		let gbs: any = {};
		let reits: any = {};
		let otherIts: any = {};
		uploadedInstruments.forEach((ins: InstrumentInput) => {
			let id = ins.id;
			let instrument: any = insData[id];
			if (!instrument) isFund(id) ? mfs[id] = ins : isBond(id) ? bonds[id] = ins : equities[id] = ins;
			else if (instrument.itype === InsType.REIT) reits[id] = ins;
			else if (instrument.itype === InsType.InvIT) otherIts[id] = ins;
			else if (instrument.itype === InsType.ETF) etfs[id] = ins;
			else if (isFund(id) && !instrument.itype) mfs[id] = ins;
			else if (instrument.subt === AssetSubType.GoldB) gbs[id] = ins;
			else if(instrument.type === AssetType.F) bonds[id] = ins;
			else equities[id] = ins;
		});
		setBonds(bonds);
		setEquities(equities);
		setMFs(mfs);
		setETFs(etfs);
		setGBs(gbs);
		setREITs(reits);
		setOtherIts(otherIts);
		setEquitiesNum(Object.keys(equities).length);
		setBondsNum(Object.keys(bonds).length);
		setETFsNum(Object.keys(etfs).length);
		setMFsNum(Object.keys(mfs).length);
		setGBsNum(Object.keys(gbs).length);
		setREITsNum(Object.keys(reits).length);
		setOtherItsNum(Object.keys(otherIts).length);
	}

	useEffect(() => {
		allocateInstruments();
	}, [uploadedInstruments]);

	const loadInstrumentPrices = async (fun: Function, ids: Array<string>, allInsData: any) => {
		if (!ids.length) return null;
		for(let id of ids) {
			if(allInsData[id]) continue;
			let matchingList: Array<any> | null = await fun(ids);
			let unmatched: Array<string> = [];
			ids.forEach((id: string) => {
				let matchingEntry: InstrumentInput | null = matchingList?.find((match) => match?.id === id); 
				if (matchingEntry) allInsData[id] = matchingEntry;
				else unmatched.push(id);
			});
			return unmatched;
		}
		return null;
	};

	const selectCurrency = () => {
		let currency = 'INR';
		if (!currencyList[currency]) {
			currencyList[currency] = currency;
			setCurrencyList(currencyList);
		}
		setSelectedCurrency(currency);
		return currency;
	};

	const addInstruments = async () => {
		setProcessing(true);
		let currency = selectCurrency();
		let member = taxId ? await addMemberIfNeeded(allFamily, setAllFamily, taxId) : memberKey;
		if (uploadedInstruments.length) {
			let condition = (instrument: any) => overwrite ? instrument?.fId !== member : instrument?.fId === member;
			let filteredIns: Array<InstrumentInput> = instruments.filter(
				(instrument: InstrumentInput) => instrument.curr === selectedCurrency && condition(instrument)
			);
			uploadedInstruments.forEach((instrument: InstrumentInput) => {
				instrument.curr = currency;
				instrument.fId = member as string;
			})
			filteredIns.push(...uploadedInstruments);
			setInstruments([...filteredIns]);
			setSelectedMembers([...[member]]);
		}
		resetState();
	};

	const loadInstruments = async (ids: Array<string>) => {
		let mfIds: Array<string> = [];
		let bondIds: Array<string> = [];
		let exchangeIds: Array<string> = [];
		ids.forEach((id: string) => {
			isFund(id) ? mfIds.push(id) : bondIds.push(id);
		});
		let allInsData: any = simpleStorage.get(LOCAL_INS_DATA_KEY);
		if(!allInsData) allInsData = {};
		let unmatchedIds: Array<string> | null = [];
		if(mfIds.length) unmatchedIds = await loadInstrumentPrices(loadMatchingINMutual, mfIds, allInsData);
		if(unmatchedIds?.length) exchangeIds.push(...unmatchedIds);
		if(bondIds.length) unmatchedIds = await loadInstrumentPrices(loadMatchingINBond, bondIds, allInsData);
		if(unmatchedIds?.length) exchangeIds.push(...unmatchedIds);
		if(exchangeIds.length) await loadInstrumentPrices(loadMatchingINExchange, exchangeIds, allInsData);
		simpleStorage.set(LOCAL_INS_DATA_KEY, allInsData, LOCAL_DATA_TTL);
		return allInsData;
	};

	const loadData = async (
		insMap: Map<string, number>,
		currency: string,
	) => {
		setLoading(true);
		await loadInstruments(Array.from(insMap.keys()));
		let uploadedInstruments: Array<InstrumentInput> = [];
		insMap.forEach((value: number, id: string) => {
			uploadedInstruments.push({
				id: id,
				qty: value,
				fId: '',
				curr: currency
			});
		});
		setLoading(false);
		setShowInsUpload(true);
		setUploadedInstruments([...uploadedInstruments]);
	};

	const parseHoldings = async (pdf: any) => {
		let holdingStarted = false;
		let isin: string | null = null;
		let fv: number | null = null;
		let skipFirstNumber = false;
		let taxId: string | null = null;
		let insMap: Map<string, number> = new Map();
		let eof = false;
		for (let i = 1; i <= pdf.numPages && !eof; i++) {
			if(eof) break;
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			for (let j = 0; j < textContent.items.length; j++) {
				let value = textContent.items[j].str.trim();
				if (!value.length || value.length > 50) continue;
				if (!taxId && value.length >= 10) {
					taxId = extractPAN(value);
					if (taxId) {
						console.log("Detected PAN: ", taxId);
						setTaxId(taxId);
						continue;
					}
				}
				if (!holdingStarted) {
					holdingStarted = includesAny(value, ["holding"]);
					if(holdingStarted) console.log("holding started...", value);
					continue;
				}
				if (!eof && includesAny(value, [ 'end of report', 'end of statement' ])) {
					console.log("Detected end: ", value);
					eof = true;
				}
				if (
					includesAny(value, [
						'transaction details',
						'commission',
						'transaction statement',
						'statement of transactions',
						'other details',
						'txn:'
					])
				) {
					console.log("Ending holdings: ", value);
					isin = null;
					holdingStarted = false;
					continue;
				}
				console.log("Value is: ", value);
				if (holdingStarted && !isin) {
					if(includesAny(value, [ 'nav', 'bonds', 'face value per bond', 'face value per unit' ])) {
						skipFirstNumber = false;
						continue;
					} else if(includesAny(value, [ 'face value', 'coupon rate' ])) {
						skipFirstNumber = true;
						continue;
					}
				}
				if(!isin) {
					isin = extractISIN(value);
					if (isin) {
						console.log('Detected ISIN: ', isin);
						fv = null;
					}
				}
				if (!isin) continue;
				let qty: number | null = getQty(value);
				if (qty == null) continue;
				if (skipFirstNumber && fv == null) {
					console.log('Detected skip quantity: ', qty);
					fv = qty;
					continue;
				}
				console.log('Detected quantity: ', qty);
				if(qty) {
					if(insMap.has(isin))
						qty += insMap.get(isin) as number;
					insMap.set(isin, qty);
				}
				if (skipFirstNumber) fv = null;
				isin = null;
			}
		}
		if (!taxId) {
			setError('Please select approriate family member');
		}
		await loadData(insMap, 'INR');
	};

	const contentWithBadge = (count: number, content: string) => {
		return (
			<Badge count={count} offset={[ 10, 0 ]} style={{marginRight: count > 9 ? 8 : 2}}>
				{content}
				&nbsp;
			</Badge>
		);
	};

	const uploadContent = () => {
		return (<><p className="ant-upload-drag-icon">
			<InboxOutlined className="upload-icon" />
		</p>
		<p className="ant-upload-text">Click or drag the pdf file to this area to upload</p>
		<p className="ant-upload-hint">
			Supports single pdf upload only. Please upload the latest file to get relevant results.
		</p></>)
	}

	return (
		<Fragment>
			<Button icon={<UploadOutlined />} onClick={onShowDrawer} type="primary">
				Upload Statement
			</Button>
			<Drawer
				width={isMobileDevice(fsb) ? 320 : 550}
				title="Upload NSDL or CSDL Monthly PDF Statement"
				placement="right"
				closable={false}
				onClose={() => {
					resetState();
					setDrawerVisibility(false);
				}}
				visible={showDrawer}
			>
				<Dragger {...getUploaderSettings(parseHoldings)}>
					{loading ? <Spin tip='Loading...' size='large'/> : uploadContent()}
				</Dragger>
			</Drawer>
			<Drawer
				className="upload-holdings-drawer"
				width={isMobileDevice(fsb) ? 320 : 550}
				title={
					uploadedInstruments.length ? (
						<Fragment>
							{error && (
								<p>
									<Alert type="error" message={error} />
								</p>
							)}
							<Row justify="space-between">
								<Col>
									<UserOutlined />
									{taxId ? (
										<strong>{taxId}</strong>
									) : (
										<SelectInput
											pre=""
											value={memberKey ? memberKey : 'Select a Member'}
											options={getFamilyOptions(allFamily)}
											changeHandler={(key: string) => {
												setMemberKey(key);
												setError('');
											}}
										/>
									)}
								</Col>
								<Col>
									<Badge count={uploadedInstruments.length} />
								</Col>
							</Row>
							<Row>
								<HSwitch value={overwrite} setter={setOverwrite} leftText="Do you want to overwrite?" />
							</Row>
						</Fragment>
					) : null
				}
				placement="right"
				closable={false}
				visible={showInsUpload}
				footer={
					<div className="text-right">
						<Button
							onClick={() => setShowInsUpload(false)}
							style={{ marginRight: 8 }}
							disabled={processing}
						>
							Cancel
						</Button>
						<Button
							onClick={() => addInstruments()}
							type="primary"
							loading={processing}
							disabled={!taxId && !memberKey}
						>
							Done
						</Button>
					</div>
				}
			>
				{uploadedInstruments.length ? (
					<Tabs defaultActiveKey="E" type="card">
						{equitiesNum && <TabPane key="E" tab={contentWithBadge(equitiesNum, 'Equities')}>
							<HoldingsTable
								data={equities}
								onChange={setEquities}
								num={equitiesNum}
								onNumChange={setEquitiesNum}
							/>
						</TabPane>}
						{mfsNum && <TabPane key="M" tab={contentWithBadge(mfsNum, 'Mutual Funds')}>
							<HoldingsTable data={mfs} onChange={setMFs} num={mfsNum} onNumChange={setMFsNum} />
						</TabPane>}
						{bondsNum && <TabPane key="B" tab={contentWithBadge(bondsNum, 'Bonds')}>
							<HoldingsTable data={bonds} onChange={setBonds} num={bondsNum} onNumChange={setBondsNum} />
						</TabPane>}
						{gbsNum && <TabPane key="GB" tab={contentWithBadge(gbsNum, 'Gold Bonds')}>
							<HoldingsTable data={gbs} onChange={setGBs} num={gbsNum} onNumChange={setGBsNum} />
						</TabPane>}
						{etfsNum && <TabPane key="ETF" tab={contentWithBadge(etfsNum, 'ETFs')}>
							<HoldingsTable data={etfs} onChange={setETFs} num={etfsNum} onNumChange={setETFsNum} />
						</TabPane>}
						{reitsNum && <TabPane key="REIT" tab={contentWithBadge(reitsNum, 'REITs')}>
							<HoldingsTable data={reits} onChange={setREITs} num={reitsNum} onNumChange={setREITsNum} />
						</TabPane>}
						{otherItsNum && <TabPane key="INVIT" tab={contentWithBadge(otherItsNum, 'Other Investment Trusts')}>
							<HoldingsTable
								data={otherIts}
								onChange={setOtherIts}
								num={otherItsNum}
								onNumChange={setOtherItsNum}
							/>
						</TabPane>}
					</Tabs>
				) : (
					<Empty
						description={<h2>No data found in the uploaded file.</h2>}
						image={<FontAwesomeIcon icon={faFilePdf} size="3x" />}
					/>
				)}
			</Drawer>
		</Fragment>
	);
}
