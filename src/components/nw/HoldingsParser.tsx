import React, { useState } from "react";
import { Upload, Empty, Drawer, Button, Statistic, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import {
	countWords,
	getNumberAtEnd,
	isMobileDevice,
	removeDuplicates,
} from "../utils";
import { getValueBefore, includesAny, replaceIfFound } from "../utils";
import HoldingTabs from "./HoldingTabs";
import HoldingsChart from "./HoldingsChart";
import HoldingsFilter from "./HoldingsFilter";
import DataSwitcher from "../DataSwitcher";

import "./nw.less";
import {
	cleanAssetName,
	completeRecord,
	contains,
	getISIN,
	getQty,
	getUploaderSettings,
	hasHoldingStarted,
} from "./parseutils";

export default function HoldingsParser() {
	const fsb = useFullScreenBrowser();
	const { Option } = Select;
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [allETFs, setAllETFs] = useState<any>({});
	const [showUpdateHoldings, setUpdateHoldings] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const [taxId, setTaxId] = useState<string>("");
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	const { Dragger } = Upload;

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let etfs: any = {};
		let mode = "M";
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
		let numberAtEnd: string | null = null;
		let checkForMultiple = true;
		for (let i = 1; i <= pdf.numPages && !eof; i++) {
			lastNameCapture = null;
			lastQtyCapture = null;
			if (i > 1) {
				if (isin || quantity) recordBroken = true;
				else recordBroken = false;
				if (!recordBroken) {
					isin = null;
					quantity = null;
					name = null;
				}
			}
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			if (i > 2) console.log("Text content: ", textContent);
			for (let j = 0; j < textContent.items.length; j++) {
				let value = textContent.items[j].str.trim();
				if (!value.length) continue;
				if (value.length >= 10 && value.length < 100 && !taxId) {
					taxId = contains(value, "PAN");
					if (taxId) continue;
				}
				if (!holdingStarted) {
					holdingStarted = hasHoldingStarted(value);
					continue;
				}
				console.log("Going to check: ", value);
				if (value.length > 100) continue;
				if (
					includesAny(value, [
						"commission paid",
						"end of statement",
						"end of report",
					])
				) {
					eof = true;
					break;
				}
				if (hasData && includesAny(value, ["transaction details"])) break;
				if (includesAny(value, ["face value"])) {
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
					])
				)
					continue;
				let retVal = getISIN(value);
				if (!retVal) {
					retVal = contains(value);
				}
				if (retVal) {
					if (lastQtyCapture && j - lastQtyCapture > 9) {
						console.log("Detected unrelated qty capture: ", lastQtyCapture);
						quantity = null;
						lastQtyCapture = null;
					}
					console.log("Detected ISIN: ", retVal);
					isin = retVal;
					mode = isin.startsWith("INF") ? "M" : "E";
					if (isin && quantity)
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
							mode,
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
				if (quantity) continue;
				if (!isin && value.toLowerCase().includes("page")) continue;
				let numberOfWords = countWords(value);
				if (
					!recordBroken &&
					value.length > 7 &&
					numberOfWords > 1 &&
					numberOfWords < 15 &&
					!value.includes(",")
				) {
					if (includesAny(value, ["bond", "bd", "ncd", "debenture"]))
						mode = "B";
					else if (includesAny(value, ["etf"])) mode = "ETF";
					if (checkForMultiple) numberAtEnd = getNumberAtEnd(value);
					if (numberAtEnd) console.log("Detected number at end: ", numberAtEnd);
					if (lastNameCapture) {
						let diff = j - lastNameCapture;
						if (mode !== "M" && mode !== "ETF" && !numberAtEnd && diff < 4)
							continue;
					}
					if (numberAtEnd) value = replaceIfFound(value, ["" + numberAtEnd]);
					value = cleanAssetName(value);
					if (!value) {
						numberAtEnd = null;
						continue;
					}
					if (
						(mode === "M" || mode === "ETF") &&
						name &&
						lastNameCapture &&
						j - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					if (mode === "M" || mode === "ETF") {
						name = removeDuplicates(name as string);
						name = getValueBefore(name as string, ["(", ")"]);
					}
					lastNameCapture = j;
					quantity = null;
					lastQtyCapture = null;
					console.log("Detected name: ", name);
				} else numberAtEnd = null;
				let qty: number | null =
					checkForMultiple && name && numberAtEnd
						? parseFloat(numberAtEnd)
						: getQty(value, mode === "M" || mode === "ETF");
				if (!qty) continue;
				if (!recordBroken && lastQtyCapture && j - lastQtyCapture < 7) continue;
				if (hasFV && !fv && mode === "E") {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
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
						mode,
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
		setAllBonds(bonds);
		setAllEquities(equities);
		setAllMFs(mfs);
		setAllETFs(etfs);
		setInsNames(insNames);
		setUpdateHoldings(true);
		if (taxId) setTaxId(taxId);
	};

	const hasNoHoldings = () =>
		!Object.keys(allBonds).length &&
		!Object.keys(allEquities).length &&
		!Object.keys(allMFs).length;

	function onCloseUpdateHoldings() {
		setUpdateHoldings(false);
	}

	return (
		<div className="nw-container">
			<Statistic
				title="Total Portfolio Value"
				value={213454654}
				prefix={
					<Select defaultValue="₹">
						<Option value="₹">₹</Option>
						<Option value="$">$</Option>
						<Option value="€">€</Option>
					</Select>
				}
			/>
			<DataSwitcher title={<h3>Holdings details</h3>}>
				<Chart>
					<HoldingsChart />
				</Chart>
				<DataSwitcherList>
					<HoldingsFilter />
					<HoldingTabs
						equities={allEquities}
						bonds={allBonds}
						mutualFunds={allMFs}
						insNames={insNames}
					/>
				</DataSwitcherList>
			</DataSwitcher>
			<Dragger {...getUploaderSettings(parseHoldings)}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined className="upload-icon" />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
				<p className="ant-upload-hint">
					Supports single pdf upload. Strictly prohibit from uploading company
					data or other band files
				</p>
			</Dragger>
			{!hasNoHoldings() ? (
				<>
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
						visible={showUpdateHoldings}
						footer={
							<div className="text-right">
								<Button
									onClick={onCloseUpdateHoldings}
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button onClick={onCloseUpdateHoldings} type="primary">
									Update
								</Button>
							</div>
						}
					>
						<HoldingTabs
							equities={allEquities}
							bonds={allBonds}
							mutualFunds={allMFs}
							etfs={allETFs}
							insNames={insNames}
						/>
					</Drawer>
					<DataSwitcher title={<h3>Holdings details</h3>}>
						<Chart>
							<HoldingsChart />
						</Chart>
						<DataSwitcherList>
							<HoldingsFilter />
							<HoldingTabs
								equities={allEquities}
								bonds={allBonds}
								mutualFunds={allMFs}
								etfs={allETFs}
								insNames={insNames}
							/>
						</DataSwitcherList>
					</DataSwitcher>
				</>
			) : (
				<Empty description={<p>No investment data.</p>} />
			)}
		</div>
	);
}
