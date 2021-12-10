import React, { useState, useContext, useEffect, Fragment } from "react";
import { Button, Upload, Drawer, Tabs, Row, Badge, Col, Alert, Empty } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import HoldingsTable from "./HoldingsTable";
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../AppContext";
import { NWContext } from "./NWContext";
import { getInsTypeFromISIN, getUploaderSettings } from "./parseutils";
import { isMobileDevice } from "../utils";
import simpleStorage from "simplestorage.js";
import { AssetSubType, AssetType, InstrumentInput } from "../../api/goals";
import { UserOutlined } from "@ant-design/icons";
import {
	completeRecord,
	contains,
	getISIN,
	getQty,
	hasHoldingStarted,
} from "./parseutils";
import {
	includesAny,
} from "../utils";
import { addMemberIfNeeded, getFamilyOptions, loadMatchingINBond, loadMatchingINExchange, loadMatchingINMutual } from "./nwutils";
import SelectInput from "../form/selectinput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export default function UploadHoldings() {
	const { insData }: any = useContext(AppContext);
	const { showInsUpload,
		setShowInsUpload,
		instruments,
		setInstruments,
		allFamily,
		setAllFamily,
		currencyList,
		setCurrencyList,
		setSelectedCurrency, 
	}: any = useContext(NWContext);
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;
	const [equities, setEquities] = useState<any>({});
	const [bonds, setBonds] = useState<any>({});
	const [mutualFunds, setMutualFunds] = useState<any>({});
	const [etfs, setETFs] = useState<any>({});
	const [equitiesNum, setEquitiesNum] = useState<number>(0);
	const [bondsNum, setBondsNum] = useState<number>(0);
	const [etfsNum, setETFsNum] = useState<number>(0);
	const [mfsNum, setMFsNum] = useState<number>(0);
	const { Dragger } = Upload;
	const [showDrawer, setDrawerVisibility] = useState(false);
	const [processing, setProcessing ] = useState<boolean>(false);
	const [taxId, setTaxId] = useState<string | null>(null);
	const [memberKey, setMemberKey] = useState<string | null>(null);
	const [error, setError] = useState<string>('');

	useEffect(() => setDrawerVisibility(!Object.keys(instruments).length), []);

	useEffect(() => {
		if(showInsUpload) {
			setDrawerVisibility(false);
		}
	}, [showInsUpload]);

	const onShowDrawer = () => setDrawerVisibility(true);

	const resetState = () => {
		setTaxId(null);
		setMemberKey(null);
		setError('');
		setProcessing(false);
		setShowInsUpload(false);
	}

	const loadInstrumentPrices = async (fun: Function, input: any, memberKey: string, filteredIns: Array<InstrumentInput>) => {
		if(!input || !Object.keys(input).length || !memberKey) return null;
		let unmatched: any = {};
		let matchingList: Array<any> | null = null;
		Object.keys(input).forEach(async(key) => {
			if(!insData[key]) return matchingList = await fun(Object.keys(input));
		});
		Object.keys(input).forEach((key) => {
			let instrument = input[key];
			let matchingEntry: InstrumentInput | null = insData[key] ? insData[key] : null;
			if(!matchingEntry && matchingList && matchingList.length) 
				matchingEntry = matchingList?.find((match) => match?.id === key);
			if(matchingEntry) {
				insData[key] = matchingEntry;
			} else unmatched[key] = instrument;
			instrument.curr = 'INR'
			instrument.fId = memberKey;
			filteredIns.push(instrument);
		})
		return unmatched;
	};

	const addInstruments = async () => {
		setProcessing(true);
		let member = taxId ? await addMemberIfNeeded(allFamily, setAllFamily, taxId) : memberKey;
		let currency = 'INR';
		if(!currencyList[currency]) {
			currencyList[currency] = currency;
			setCurrencyList(currencyList);
		}
		setSelectedCurrency(currency);
		if(equitiesNum || mfsNum || bondsNum || etfsNum) {
			let filteredInsByCurr: Array<InstrumentInput> = instruments.filter((instrument: InstrumentInput) => instrument.curr !== instrument.curr);
			await loadInstrumentPrices(loadMatchingINMutual, mutualFunds, member as string, filteredInsByCurr);
			let unmatchedBonds = await loadInstrumentPrices(loadMatchingINBond, bonds, member as string, filteredInsByCurr);
			if(unmatchedBonds && Object.keys(unmatchedBonds).length) 
				Object.keys(unmatchedBonds).forEach((key: string) => equities[key] = unmatchedBonds[key]);
			if(etfs && Object.keys(etfs).length)
				Object.keys(etfs).forEach((key: string) => equities[key] = etfs[key]);
			await loadInstrumentPrices(loadMatchingINExchange, equities, member as string, filteredInsByCurr);
			simpleStorage.set(LOCAL_INS_DATA_KEY, insData, LOCAL_DATA_TTL);
			let filteredIns: Array<InstrumentInput> = instruments.filter((instrument: InstrumentInput) => instrument.curr !== instrument.curr || instrument?.fId !== member);
			setInstruments([...filteredIns]);
		}
		resetState();
	}
	
	const setValues = (equities: any, bonds: any, mfs: any, etfs: any) => {
		setBonds(bonds);
		setEquities(equities);
		setMutualFunds(mfs);
		setETFs(etfs);
		setEquitiesNum(Object.keys(equities).length);
		setBondsNum(Object.keys(bonds).length);
		setETFsNum(Object.keys(etfs).length);
		setMFsNum(Object.keys(mfs).length);
		setShowInsUpload(true);
	};

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
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
		let currency = 'INR';
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
					console.log("Detected broken record...");
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
					((!recordBroken && lastQtyCapture === null) ||
						(lastQtyCapture !== null && j - lastQtyCapture > 9))
				) {
					console.log("Detected unrelated qty capture: ", lastQtyCapture);
					quantity = null;
					lastQtyCapture = null;
					fv = null;
				}
				let value = textContent.items[j].str.trim();
				if (!value.length) continue;
				if (value.length >= 10 && value.length < 100 && !taxId) {
					taxId = contains(value, "PAN");
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
				if (includesAny(value, ["end of report"])) {
					eof = true;
					break;
				}
				if (includesAny(value, ["transaction details", "commission paid", "transaction particulars", "statement of transactions", "other details", "transactions for the period"])) {
					isin = null;
					quantity = null;
					holdingStarted = false;
					lastQtyCapture = null;
					continue;
				}
				if (
					holdingStarted &&
					!hasData &&
					!isin &&
					includesAny(value, ["face value", "coupon rate"])
				) {
					hasFV = true;
					continue;
				}
				let retVal = getISIN(value);
				if(retVal) {
					console.log("Detected ISIN: ", retVal);
					quantity = null;
					fv = null;
					recordBroken = false;
					isin = retVal;
					insType = getInsTypeFromISIN(isin, insType);
				}
				if (!isin) continue;
				let qty: number | null = getQty(value);
				if (!qty) continue;
				if(insType === 'M' && !value.includes(".")) continue;
				if (hasFV && !fv && (insType === AssetSubType.S || insType === AssetType.F)) {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
				if (insType === AssetType.F && !Number.isInteger(qty)) continue;
				console.log("Detected quantity: ", qty);
				lastQtyCapture = j;
				quantity = qty;
				if (hasFV) fv = null;
				completeRecord(
					recordBroken,
					insType as string,
					equities,
					mfs,
					etfs,
					bonds,
					isin,
					quantity,
					taxId as string,
					currency
				);
				isin = null;
				quantity = null;
				hasData = true;
			}
		}
		if(!taxId) {
			setError('Please select approriate family member');
		}
		setValues(equities, bonds, mfs, etfs);
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
					<p className="ant-upload-text">
						Click or drag the pdf file to this area to upload
					</p>
					<p className="ant-upload-hint">
						Supports single pdf upload only. Please upload the latest file to get relevant results.
					</p>
				</Dragger>
			</Drawer>
			<Drawer
				className="upload-holdings-drawer"
				width={isMobileDevice(fsb) ? 320 : 550}
				title={(equitiesNum || etfsNum || mfsNum || bondsNum) ? 
					<Fragment>
						{error && <p>
							<Alert type="error" message={error} />
						</p>}
						<Row justify="space-between">
							<Col>
								<UserOutlined />
								{taxId ? 
								<strong>{taxId}</strong>
									: <SelectInput
										pre=""
										value={memberKey ? memberKey : 'Select a Member'}
										options={getFamilyOptions(allFamily)}
										changeHandler={(key: string) => {
											setMemberKey(key);
											setError('');
										}} />
								}
							</Col>
							<Col><Badge count={equitiesNum + mfsNum + etfsNum + bondsNum} showZero /></Col>
						</Row>
					</Fragment>
				: null}
				placement="right"
				closable={false}
				visible={showInsUpload}
				footer={
					<div className="text-right">
						<Button onClick={() => setShowInsUpload(false)} style={{ marginRight: 8 }} disabled={processing}>
							Cancel
						</Button>
						<Button onClick={() => addInstruments()} type="primary" loading={processing} disabled={!taxId && !memberKey}>
							Done
						</Button>
					</div>
				}
			>
				{(equitiesNum || etfsNum || mfsNum || bondsNum) ? <Tabs defaultActiveKey="E" type="card">
					<TabPane key="E" tab={
						<Row align="middle">
							<Col>Equities&nbsp;</Col>
							<Col><Badge count={equitiesNum} showZero /></Col>
						</Row>
					}>
						<HoldingsTable data={equities} onChange={setEquities} num={equitiesNum} onNumChange={setEquitiesNum} />
					</TabPane>
					<TabPane key="B" tab={
						<Row align="middle">
							<Col>Bonds&nbsp;</Col>
							<Col><Badge count={bondsNum} showZero /></Col>
						</Row>
					}>
						<HoldingsTable data={bonds} onChange={setBonds} num={bondsNum} onNumChange={setBondsNum} />
					</TabPane>
					<TabPane key="M" tab={
						<Row align="middle">
							<Col>Mutual Funds&nbsp;</Col>
							<Col><Badge count={mfsNum} showZero /></Col>
						</Row>
					}>
						<HoldingsTable data={mutualFunds} onChange={setMutualFunds} num={mfsNum} onNumChange={setMFsNum} />
					</TabPane>
					<TabPane key="ETF" tab={
						<Row align="middle">
							<Col>ETFs&nbsp;</Col>
							<Col><Badge count={etfsNum} showZero /></Col>
						</Row>
					}>
						<HoldingsTable data={etfs} onChange={setETFs} num={etfsNum} onNumChange={setETFsNum} />
					</TabPane>
				</Tabs> : <Empty description={<h2>No data found in the uploaded file.</h2>} 
				image={<FontAwesomeIcon icon={faFilePdf} size="3x" />} />}
			</Drawer>
		</Fragment>
	);
}
