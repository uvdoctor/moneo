import React, { useState, useContext, useEffect } from "react";
import { Button, Upload, Drawer, Tabs } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import HoldingsTable from "./HoldingsTable";
import { NWContext } from "./NWContext";
import { getUploaderSettings } from "./parseutils";
import { isMobileDevice } from "../utils";
import { HoldingInput } from "../../api/goals";
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
		setSelectedMembers
	}: any = useContext(NWContext);
	const { Dragger } = Upload;
	const [showDrawer, setDrawerVisibility] = useState(false);
	console.log("Holdings: ", holdings);

	useEffect(() => setDrawerVisibility(!holdings || !Object.keys(holdings).length), []);

	useEffect(() => setDrawerVisibility(!showInsUpload), [showInsUpload]);

	function onShowDrawer() {
		setDrawerVisibility(true);
	}

	const addUploadedInstruments = (insHoldings: Array<HoldingInput>, list: any, currency: string) => {
		let keys = Object.keys(list);
		if(!list || !keys.length) return;
		keys.forEach((key: string) => 
			insHoldings.push({
				id: key,
				qty: list[key].quantity,
				name: list[key].name,
				type: list[key].type,
				fIds: [taxId],
				curr: currency
			})
		);
	};

	const filterExistingTaxIdEntries = () => {
		let filteredEntries =  holdings.instruments?.filter((entry: HoldingInput) => !entry.fIds.includes(taxId));
		return !filteredEntries?.length ? [] : filteredEntries;
	};

	const addInstruments = () => {
		if(!taxId) return;
		let id = addFamilyMemberSilently(allFamily, setAllFamily, taxId);
		setSelectedMembers([...[id]]);
		holdings.instruments = filterExistingTaxIdEntries();
		let currency = 'INR';
		if(!currencyList[currency]) {
			currencyList[currency] = currency;
			setCurrencyList(currencyList);
		}
		setSelectedCurrency(currency);
		addUploadedInstruments(holdings.instruments, equities, currency);
		addUploadedInstruments(holdings.instruments, bonds, currency);
		addUploadedInstruments(holdings.instruments, etfs, currency);
		addUploadedInstruments(holdings.instruments, mutualFunds, currency);
		setHoldings(holdings);
		setDrawerVisibility(false);
		setShowInsUpload(false);
	}
	
	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
		let insType = "M";
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
				if (includesAny(value, ["commission paid", "end of report"])) {
					eof = true;
					break;
				}
				if (hasData && includesAny(value, ["transaction details"])) break;
				if (
					holdingStarted &&
					!hasData &&
					!isin &&
					includesAny(value, ["face value"])
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
						"%",
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
						"year",
					])
				)
					continue;
				let retVal = getISIN(value);
				if (!retVal) {
					retVal = contains(value);
				}
				if (retVal) {
					console.log("Detected ISIN: ", retVal);
					isin = retVal;
					if (isin.startsWith("INF")) {
						if (insType !== "ETF") insType = "M";
					} else if (isin.startsWith("IN0")) insType = "B";
					else if (insType !== "B") insType = "E";
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
							name
						));
						continue;
					}
				}
				if (quantity) continue;
				if (!isin && includesAny(value, ["page"])) continue;
				console.log("Going to check: ", value);
				let numberOfWords = countWords(value);
				if (
					!recordBroken &&
					value.length > 7 &&
					numberOfWords > 1 &&
					numberOfWords < 15 &&
					!value.includes(",")
				) {
					if (includesAny(value, ["bond", "bd", "ncd", "debenture", "sgb"]))
						insType = "B";
					else if (value.includes("ETF")) insType = "ETF";
					else if (value.includes("REIT") || value.includes("FMP"))
						insType = "M";
					else insType = "E";
					if (checkForMultiple) numberAtEnd = getNumberAtEnd(value);
					if (lastNameCapture) {
						let diff = j - lastNameCapture;
						if (
							insType !== "M" &&
							insType !== "ETF" &&
							!numberAtEnd &&
							diff < 4
						)
							continue;
					}
					if (numberAtEnd) value = replaceIfFound(value, ["" + numberAtEnd]);
					value = cleanAssetName(value);
					if (!value) {
						numberAtEnd = null;
						continue;
					}
					if (
						(insType === "M" || insType === "ETF") &&
						name &&
						lastNameCapture &&
						j - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					if (insType === "M" || insType === "ETF") {
						name = removeDuplicates(name as string);
						name = getValueBefore(name as string, ["(", ")"]);
					}
					lastNameCapture = j;
					quantity = null;
					lastQtyCapture = null;
					fv = null;
					console.log("Detected name: ", name);
				}
				let qty: number | null =
					checkForMultiple && name && numberAtEnd ? numberAtEnd : getQty(value);
				if (!qty) continue;
				if (
					!recordBroken &&
					((name && lastNameCapture && j - lastNameCapture > 5) ||
						(lastQtyCapture && j - lastQtyCapture < 7))
				)
					continue;
				if (hasFV && !fv && insType === "E") {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
				if (insType === "B" && !Number.isInteger(qty)) continue;
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
						name
					));
				}
			}
		}
		setBonds(bonds);
		setEquities(equities);
		setMutualFunds(mfs);
		setETFs(etfs);
		setShowInsUpload(true);
		console.log(equities);
	};

	return (
		<>
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
					<>
						Update holdings for PAN no <strong>{taxId}</strong>
					</>
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
					<TabPane key="E" tab="Equities">
						<HoldingsTable data={equities} onChange={setEquities} />
					</TabPane>
					<TabPane key="B" tab="Bonds">
						<HoldingsTable data={bonds} onChange={setBonds} />
					</TabPane>
					<TabPane key="M" tab="Mutual Funds">
						<HoldingsTable data={mutualFunds} onChange={setMutualFunds} />
					</TabPane>
					<TabPane key="ETF" tab="ETFs">
						<HoldingsTable data={etfs} onChange={setETFs} />
					</TabPane>
				</Tabs>
			</Drawer>
		</>
	);
}
