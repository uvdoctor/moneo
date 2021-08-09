import React, { useState, useContext, useEffect, Fragment } from "react";
import { Button, Upload, Drawer, Tabs, Row, Badge, Col } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import HoldingsTable from "./HoldingsTable";
import { NWContext } from "./NWContext";
import { getUploaderSettings } from "./parseutils";
import { isMobileDevice } from "../utils";
import { HoldingInput, InsSubType, InsType } from "../../api/goals";
import {
	cleanAssetName,
	completeRecord,
	contains,
	getISIN,
	getQty,
	hasHoldingStarted,
} from "./parseutils";
import {
	getValueBefore,
	includesAny,
	replaceIfFound,
	countWords,
	getNumberAtEnd,
	removeDuplicates,
} from "../utils";
import { addFamilyMemberSilently } from "./nwutils";


export default function UploadHoldings() {
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
	
	const {
		showInsUpload,
		setShowInsUpload,
		taxId,
		setTaxId,
		holdings,
		setHoldings,
		allFamily,
		setAllFamily,
		currencyList,
		setCurrencyList,
		setSelectedCurrency,
	}: any = useContext(NWContext);
	const { Dragger } = Upload;
	const [showDrawer, setDrawerVisibility] = useState(false);

	useEffect(() => setDrawerVisibility(!holdings || !Object.keys(holdings).length), []);

	useEffect(() => {
		if(showInsUpload) setDrawerVisibility(false);
	}, [showInsUpload]);

	function onShowDrawer() {
		setDrawerVisibility(true);
	}

	const addUploadedInstruments = (insHoldings: Array<HoldingInput>, list: any) => {
		if(!list || !Object.keys(list).length) return;
		insHoldings.push(...Object.values(list) as Array<HoldingInput>);
	}

	const filterExistingTaxIdEntries = () => {
		let filteredEntries =  holdings.instruments?.filter((entry: HoldingInput) => !entry.fIds.includes(taxId));
		return !filteredEntries?.length ? [] : filteredEntries;
	};

	const addInstruments = () => {
		if(!taxId) return;
		addFamilyMemberSilently(allFamily, setAllFamily, taxId);
		holdings.instruments = filterExistingTaxIdEntries();
		let currency = 'INR';
		if(!currencyList[currency]) {
			currencyList[currency] = currency;
			setCurrencyList(currencyList);
		}
		setSelectedCurrency(currency);
		addUploadedInstruments(holdings.instruments, equities);
		addUploadedInstruments(holdings.instruments, bonds);
		addUploadedInstruments(holdings.instruments, etfs);
		addUploadedInstruments(holdings.instruments, mutualFunds);
		setHoldings(holdings);
		setDrawerVisibility(false);
		setShowInsUpload(false);
	}
	
	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
		let insType: string = InsSubType.S;
		let holdingStarted = false;
		let insNames: any = {};
		let recordBroken = false;
		let isin: string | null = null;
		let quantity: number | null = null;
		let name: string | null = null;
		let lastNameCapture: number | null = null;
		let lastQtyCapture: number | null = null;
		let fv: number | null = null;
		let hasFV = false;
		let hasData = false;
		let taxId: string | null = null;
		let eof = false;
		let checkForMultiple = true;
		let currency = 'INR';
		for (let i = 1; i <= pdf.numPages && !eof; i++) {
			lastNameCapture = null;
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
					name = null;
				}
			}
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			for (let j = 0; j < textContent.items.length; j++) {
				let numberAtEnd: number | null = null;
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
				if (
					name &&
					((!recordBroken && lastNameCapture === null) ||
						(lastNameCapture !== null && j - lastNameCapture > 9))
				) {
					console.log("Detected unrelated name capture: ", lastNameCapture);
					name = null;
					lastNameCapture = null;
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
					name = null;
					holdingStarted = false;
					lastQtyCapture = null;
					lastNameCapture = null;
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
				if (
					includesAny(value, [
						"closing",
						"opening",
						"summary",
						"year",
						"portfolio",
						"total",
						"+",
						"^",
						"pledged",
						"equities",
						"listed",
						"not",
						"value (",
						"value in",
						"free b",
						"consolidated",
						"statement",
						"account",
						"available",
						"name",
						"about",
						"no.",
						"year"
					])
				)
					continue;
				let retVal = getISIN(value);
				if (!retVal) {
					retVal = contains(value);
				}
				if (retVal) {
					console.log("Detected ISIN: ", retVal);
					if(isin && retVal && !quantity) {
						isin = null;
						name = null;
						recordBroken = false;
					}
					isin = retVal;
					if (isin.startsWith("INF")) {
						if (insType !== InsSubType.ETF) insType = InsSubType.M;
					} else if (isin.startsWith("IN0")) insType = InsType.F;
					else if(isin.startsWith("INE")) insType = InsSubType.S;
					if (isin && quantity) {
						({
							recordBroken,
							lastNameCapture,
							hasData,
							isin,
							quantity,
						} = completeRecord(
							recordBroken,
							lastNameCapture,
							j,
							hasData,
							insType,
							equities,
							mfs,
							etfs,
							bonds,
							isin,
							quantity,
							insNames,
							name,
							taxId as string,
							currency
						));
						continue;
					}
					if(!checkForMultiple) continue;
				}
				if (quantity) continue;
				if (!isin && includesAny(value, ["page"])) continue;
				let numberOfWords = countWords(value);
				if (
					!recordBroken &&
					value.length > 7 &&
					numberOfWords > 1 &&
					numberOfWords < 15 &&
					!includesAny(value, ["no :", ","])
				) {
					console.log("Going to check: ", value);
					if(name && includesAny(value, ["page"])) continue;
					if (includesAny(value, ["bond", "ncd", "debenture", "sgb"])) {
						if(isin && isin.startsWith("INF")) insType = InsSubType.M;
						else insType = InsType.F;
					} else if (value.includes("ETF")) insType = InsSubType.ETF;
					else if (value.includes("REIT") || value.includes("FMP"))
						insType = InsSubType.M;
					else if(!isin && insType !== InsSubType.M && insType !== InsType.F && insType!== InsSubType.ETF) insType = InsSubType.S;
					if (checkForMultiple) numberAtEnd = getNumberAtEnd(value);
					if (lastNameCapture) {
						let diff = j - lastNameCapture;
						if (
							insType !== InsSubType.M &&
							insType !== InsSubType.ETF &&
							!numberAtEnd &&
							diff < 4
						)
							continue;
					}
					if (numberAtEnd) value = replaceIfFound(value, ["" + numberAtEnd]);
					if(insType === InsSubType.S) value = cleanAssetName(value);
					if (!value) {
						numberAtEnd = null;
						continue;
					}
					if (
						(insType !== InsSubType.S) &&
						name &&
						lastNameCapture &&
						j - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					if (insType === InsSubType.M || insType === InsSubType.ETF) {
						name = removeDuplicates(name as string);
						name = getValueBefore(name as string, ["(", ")"]);
					}
					lastNameCapture = j;
					quantity = null;
					lastQtyCapture = null;
					fv = null;
					console.log("Detected name: ", name);
					if(!checkForMultiple) continue;
				}
				let qty: number | null =
					checkForMultiple && name && numberAtEnd ? numberAtEnd : getQty(value);
				if (!qty) continue;
				if(insType === InsSubType.M && !value.includes(".")) continue;
				if (
					!recordBroken &&
					((name && lastNameCapture && j - lastNameCapture > 5) ||
						(lastQtyCapture && j - lastQtyCapture < 7))
				)
					continue;
				if (hasFV && !fv && (insType === InsSubType.S || insType === InsType.F)) {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
				if (insType === InsType.F && !Number.isInteger(qty)) continue;
				console.log("Detected quantity: ", qty);
				lastQtyCapture = j;
				if (lastQtyCapture !== lastNameCapture) checkForMultiple = false;
				quantity = qty;
				if (hasFV) fv = null;
				if (isin && quantity) {
					({
						recordBroken,
						lastNameCapture,
						hasData,
						isin,
						quantity,
					} = completeRecord(
						recordBroken,
						lastNameCapture,
						j,
						hasData,
						insType,
						equities,
						mfs,
						etfs,
						bonds,
						isin,
						quantity,
						insNames,
						name,
						taxId as string,
						currency
					));
				}
			}
		}
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

	return (
		<Fragment>
			<Button icon={<UploadOutlined />} onClick={onShowDrawer} />
			<Drawer
				width={isMobileDevice(fsb) ? 320 : 550}
				title="Upload NSDL or CSDL Monthly Statement"
				placement="right"
				closable={false}
				onClose={() => setDrawerVisibility(false)}
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
				title={
					<Row justify="space-between">
						<Col>PAN <strong>{taxId}</strong></Col>
						<Col><Badge count={equitiesNum + mfsNum + etfsNum + bondsNum} showZero /></Col>
					</Row>
				}
				placement="right"
				closable={false}
				visible={showInsUpload}
				footer={
					<div className="text-right">
						<Button onClick={() => setShowInsUpload(false)} style={{ marginRight: 8 }}>
							Cancel
						</Button>
						<Button onClick={() => addInstruments()} type="primary">
							Done
						</Button>
					</div>
				}
			>
				<Tabs defaultActiveKey="E" type="card">
					<TabPane key="E" tab={
						<Fragment>
							Equities
							<Row justify="center">
								<Col><Badge count={equitiesNum} showZero /></Col>
							</Row>
						</Fragment>
					}>
						<HoldingsTable data={equities} onChange={setEquities} num={equitiesNum} onNumChange={setEquitiesNum} />
					</TabPane>
					<TabPane key="B" tab={
						<Fragment>
							Bonds
							<Row justify="center">
								<Col><Badge count={bondsNum} showZero /></Col>
							</Row>
						</Fragment>
					}>
						<HoldingsTable data={bonds} onChange={setBonds} num={bondsNum} onNumChange={setBondsNum} />
					</TabPane>
					<TabPane key="M" tab={
						<Fragment>
							Mutual Funds
							<Row justify="center">
								<Col><Badge count={mfsNum} showZero /></Col>
							</Row>
						</Fragment>
					}>
						<HoldingsTable data={mutualFunds} onChange={setMutualFunds} num={mfsNum} onNumChange={setMFsNum} />
					</TabPane>
					<TabPane key="ETF" tab={
						<Fragment>
							ETFs
							<Row justify="center">
								<Col><Badge count={etfsNum} showZero /></Col>
							</Row>
						</Fragment>
					}>
						<HoldingsTable data={etfs} onChange={setETFs} num={etfsNum} onNumChange={setETFsNum} />
					</TabPane>
				</Tabs>
			</Drawer>
		</Fragment>
	);
}
