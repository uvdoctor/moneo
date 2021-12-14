import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Button, Upload, Drawer, Tabs, Row, Badge, Col, Alert, Empty } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useFullScreenBrowser } from 'react-browser-hooks';
import HoldingsTable from './HoldingsTable';
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from '../AppContext';
import { NWContext } from './NWContext';
import { getInsTypeFromISIN, getUploaderSettings } from './parseutils';
import { isMobileDevice } from '../utils';
import simpleStorage from 'simplestorage.js';
import { AssetSubType, AssetType, InstrumentInput } from '../../api/goals';
import { UserOutlined } from '@ant-design/icons';
import { contains, getISIN, getQty, hasHoldingStarted } from './parseutils';
import { includesAny } from '../utils';
import {
	addMemberIfNeeded,
	getFamilyOptions,
	loadMatchingINBond,
	loadMatchingINExchange,
	loadMatchingINMutual
} from './nwutils';
import SelectInput from '../form/selectinput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import HSwitch from '../HSwitch';

export default function UploadHoldings() {
	const { insData }: any = useContext(AppContext);
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
		selectedCurrency
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
	const [ overwrite, setOverwrite ] = useState<number>(0);
	const [ pdfInstruments, setPdfInstrumnets ] = useState<Array<any>>([]);

	useEffect(() => setDrawerVisibility(!Object.keys(instruments).length), []);

	const onShowDrawer = () => setDrawerVisibility(true);

	const resetState = () => {
		setTaxId(null);
		setMemberKey(null);
		setError('');
		setProcessing(false);
		setShowInsUpload(false);
		setDrawerVisibility(false);
		setPdfInstrumnets([]);
	};

	const loadInstrumentPrices = async (fun: Function, input: any, memberKey: string) => {
		if (!input.length || !memberKey) return null;
		let member = await addMemberIfNeeded(allFamily, setAllFamily, memberKey);
		let unmatched: any = [];
		let matchingList: Array<any> | null = null;
		let ids: any = [];
		input.map((item: any) => ids.push(item.id));
		const isinNotExistInInsData = input.filter((key: any) => !insData[key.id]);
		if (isinNotExistInInsData.length > 0) matchingList = await fun(ids);
		input.forEach((key: any) => {
			let instrument: any = key;
			let matchingEntry: InstrumentInput | null = insData[key.id] ? insData[key.id] : null;
			if (!matchingEntry && matchingList && matchingList.length) {
				matchingEntry = matchingList?.find((match) => match?.id === key.id) }
			if (matchingEntry) {
				insData[key.id] = matchingEntry;
			} else unmatched.push(key);
			instrument.curr = 'INR';
			instrument.fId = member;
			pdfInstruments.push(instrument);
			setPdfInstrumnets([ ...pdfInstruments ]);
		});
		return unmatched;
	};

	const setCurrency = () => {
		let currency = 'INR';
		if (!currencyList[currency]) {
			currencyList[currency] = currency;
			setCurrencyList(currencyList);
		}
		setSelectedCurrency(currency);
	};

	const addInstruments = async () => {
		setProcessing(true);
		setCurrency();
		let member = taxId ? await addMemberIfNeeded(allFamily, setAllFamily, taxId) : memberKey;
		if (equitiesNum || mfsNum || bondsNum || etfsNum || gbsNum || reitsNum || otherItsNum) {
			let condition = (instrument: any) => overwrite ? instrument?.fId !== member : instrument?.fId === member;
			let filteredIns: Array<InstrumentInput> = instruments.filter(
				(instrument: InstrumentInput) => instrument.curr === selectedCurrency && condition(instrument)
			);
			filteredIns.length > 0
				? setInstruments([ ...filteredIns, ...pdfInstruments ])
				: setInstruments([ ...pdfInstruments ]);
		}
		resetState();
	};

	const setInsdata = async (data: any, member: string) => {
		let unmatchedIds: any = [];
		let mfIds: any = [];
		let bondIds: any = [];
		data.forEach((key: number, value: string) => {
			value.startsWith('INF') ? mfIds.push({ id: value, qty: key }) : value.startsWith('IN0') ? bondIds.push({ id: value, qty: key }) : unmatchedIds.push({ id: value, qty: key });
		});
		let unmatchedMfs = await loadInstrumentPrices(loadMatchingINMutual, mfIds, member);
		unmatchedMfs ? unmatchedIds.push(...unmatchedMfs) : null;
		let unmatchedBonds = await loadInstrumentPrices(loadMatchingINBond, bondIds, member);
		unmatchedBonds ? unmatchedIds.push(...unmatchedBonds) : null;
		await loadInstrumentPrices(loadMatchingINExchange, unmatchedIds, member);
		simpleStorage.set(LOCAL_INS_DATA_KEY, insData, LOCAL_DATA_TTL);
	};

	const setValues = (equities: any, mfs: any, bonds: any, etfs: any, gbs: any, reits: any, otherIts: any) => {
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
		setShowInsUpload(true);
	};

	const getInsdata = async (
		data: any,
		equities: any,
		mfs: any,
		bonds: any,
		etfs: any,
		gbs: any,
		reits: any,
		otherIts: any,
		taxId: any
	) => {
		await setInsdata(data, taxId);
		pdfInstruments.forEach((instrument: InstrumentInput) => {
			const data = insData[instrument.id];
			if (!data) equities[instrument.id] = instrument;
			else if (data.itype === 'REIT') reits[instrument.id] = instrument;
			else if (data.itype === 'InvIT') otherIts[instrument.id] = instrument;
			else if (data.itype === 'ETF') etfs[instrument.id] = instrument;
			else if (data.id.startsWith('INF') && !data.itype) mfs[instrument.id] = instrument;
			else if (data.subt === 'CB' || data.subt === 'GBO' || data.subt === 'GB' || data.subt === 'HB')
				bonds[instrument.id] = instrument;
			else if (data.subt === 'GoldB') gbs[instrument.id] = instrument;
			else if (data.subt === 'S' && !data.itype) equities[instrument.id] = instrument;
		});
	};

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
		let gbs: any = {};
		let reits: any = {};
		let otherIts: any = {};
		let insType: string | null = null;
		let holdingStarted = false;
		let recordBroken = false;
		let isin: string | null = null;
		let quantity: number | null = null;
		let lastQtyCapture: number | null = null;
		let fv: number | null = null;
		let hasFV = false;
		let hasData = false;
		let taxId: string | null = null;
		let eof = false;
		let data = new Map();
		for (let i = 1; i <= pdf.numPages && !eof; i++) {
			lastQtyCapture = null;
			if (i > 1) {
				if (
					(Object.keys(equities).length ||
						Object.keys(mfs).length ||
						Object.keys(etfs).length ||
						Object.keys(bonds).length) &&
					(isin || quantity)
				) {
					recordBroken = true;
					console.log('Detected broken record...');
				} else recordBroken = false;
				if (!recordBroken) {
					isin = null;
					quantity = null;
				}
			}
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			for (let j = 0; j < textContent.items.length; j++) {
				if (
					quantity &&
					((!recordBroken && lastQtyCapture === null) || (lastQtyCapture !== null && j - lastQtyCapture > 9))
				) {
					console.log('Detected unrelated qty capture: ', lastQtyCapture);
					quantity = null;
					lastQtyCapture = null;
					fv = null;
				}
				let value = textContent.items[j].str.trim();
				if (!value.length) continue;
				if (value.length >= 10 && value.length < 100 && !taxId) {
					taxId = contains(value, 'PAN');
					if (taxId) {
						setTaxId(taxId);
						continue;
					}
				}
				if (!holdingStarted) {
					holdingStarted = hasHoldingStarted(value);
					continue;
				}
				if (value.length > 100) continue;
				if (includesAny(value, [ 'end of report' ])) {
					eof = true;
					break;
				}
				if (
					includesAny(value, [
						'transaction details',
						'commission paid',
						'transaction particulars',
						'statement of transactions',
						'other details',
						'transactions for the period'
					])
				) {
					isin = null;
					quantity = null;
					holdingStarted = false;
					lastQtyCapture = null;
					continue;
				}
				if (holdingStarted && !hasData && !isin && includesAny(value, [ 'face value', 'coupon rate' ])) {
					hasFV = true;
					continue;
				}
				let retVal = getISIN(value);
				if (retVal) {
					console.log('Detected ISIN: ', retVal);
					quantity = null;
					fv = null;
					recordBroken = false;
					isin = retVal;
					insType = getInsTypeFromISIN(isin, insType);
				}
				if (!isin) continue;
				let qty: number | null = getQty(value);
				if (!qty) continue;
				if (insType === 'M' && !value.includes('.')) continue;
				if (hasFV && !fv && (insType === AssetSubType.S || insType === AssetType.F)) {
					console.log('Detected fv: ', qty);
					fv = qty;
					continue;
				}
				if (insType === AssetType.F && !Number.isInteger(qty)) continue;
				console.log('Detected quantity: ', qty);
				lastQtyCapture = j;
				quantity = qty;
				if (hasFV) fv = null;
				if (data.has(isin)) {
					const qty = data.get(isin);
					quantity += qty;
					data.delete(isin);
				}
				data.set(isin, quantity);
				isin = null;
				quantity = null;
				hasData = true;
			}
		}
		if (!taxId) {
			setError('Please select approriate family member');
		}
		await getInsdata(data, equities, mfs, bonds, etfs, gbs, reits, otherIts, taxId);
		setValues(equities, mfs, bonds, etfs, gbs, reits, otherIts);
	};

	const contentWithBadge = (count: number, content: string) => {
		return (
			<Badge count={count} offset={[ 10, 0 ]} showZero>
				{content}
			</Badge>
		);
	};

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
					<p className="ant-upload-drag-icon">
						<InboxOutlined className="upload-icon" />
					</p>
					<p className="ant-upload-text">Click or drag the pdf file to this area to upload</p>
					<p className="ant-upload-hint">
						Supports single pdf upload only. Please upload the latest file to get relevant results.
					</p>
				</Dragger>
			</Drawer>
			<Drawer
				className="upload-holdings-drawer"
				width={isMobileDevice(fsb) ? 320 : 550}
				title={
					equitiesNum || etfsNum || mfsNum || bondsNum ? (
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
									<Badge count={equitiesNum + mfsNum + etfsNum + bondsNum} showZero />
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
				{equitiesNum || etfsNum || mfsNum || bondsNum || etfsNum || gbsNum || reitsNum || otherItsNum ? (
					<Tabs defaultActiveKey="E" type="card">
						<TabPane key="E" tab={contentWithBadge(equitiesNum, 'Equities')}>
							<HoldingsTable
								data={equities}
								onChange={setEquities}
								num={equitiesNum}
								onNumChange={setEquitiesNum}
							/>
						</TabPane>
						<TabPane key="M" tab={contentWithBadge(mfsNum, 'Mutual Funds')}>
							<HoldingsTable data={mfs} onChange={setMFs} num={mfsNum} onNumChange={setMFsNum} />
						</TabPane>
						<TabPane key="B" tab={contentWithBadge(bondsNum, 'Bonds')}>
							<HoldingsTable data={bonds} onChange={setBonds} num={bondsNum} onNumChange={setBondsNum} />
						</TabPane>
						<TabPane key="GB" tab={contentWithBadge(gbsNum, 'Gold Bonds')}>
							<HoldingsTable data={gbs} onChange={setGBs} num={gbsNum} onNumChange={setGBsNum} />
						</TabPane>
						<TabPane key="ETF" tab={contentWithBadge(etfsNum, 'ETFs')}>
							<HoldingsTable data={etfs} onChange={setETFs} num={etfsNum} onNumChange={setETFsNum} />
						</TabPane>
						<TabPane key="REIT" tab={contentWithBadge(reitsNum, 'Real Estate Investment Trusts')}>
							<HoldingsTable data={reits} onChange={setREITs} num={reitsNum} onNumChange={setREITsNum} />
						</TabPane>
						<TabPane key="INVIT" tab={contentWithBadge(otherItsNum, 'Other Investment Trusts')}>
							<HoldingsTable
								data={otherIts}
								onChange={setOtherIts}
								num={otherItsNum}
								onNumChange={setOtherItsNum}
							/>
						</TabPane>
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
