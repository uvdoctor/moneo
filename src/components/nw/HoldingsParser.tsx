import React, { useState } from "react";
import { Upload, Empty, Drawer, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice, removeDuplicates } from "../utils";
import { cleanName, includesAny, replaceIfFound } from "../utils";
import HoldingTabs from "./HoldingTabs";
import HoldingsChart from "./HoldingsChart";
import HoldingsFilter from "./HoldingsFilter";
import DataSwitcher from "../DataSwitcher";

import "./nw.less";
import {
	completeRecord,
	contains,
	getISIN,
	getQty,
	getUploaderSettings,
	hasHoldingStarted,
} from "./parseutils";

export default function HoldingsParser() {
	const fsb = useFullScreenBrowser();
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [showUpdateHoldings, setUpdateHoldings] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const [taxId, setTaxId] = useState<string>("");
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	const { Dragger } = Upload;

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let mode = "";
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
		let checkMultipleValues = false;
		let hasData = false;
		let taxId: string | null = null;
		let eof = false;
		for (let i = 1; i <= pdf.numPages && !eof; i++) {
			lastNameCapture = null;
			lastQtyCapture = null;
			if (!recordBroken) {
				isin = null;
				quantity = null;
				name = null;
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
				if (includesAny(value, ["commission paid", "end of statement"])) {
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
					checkMultipleValues = true;
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
							bonds,
							isin,
							quantity,
							insNames,
							name
						));
					if (!checkMultipleValues) continue;
				}
				if (quantity) continue;
				if (!isin && value.toLowerCase().includes("page")) continue;
				if (
					isin &&
					value.toLowerCase().includes("page") &&
					j - textContent.items.length < 5
				) {
					console.log("Detected broken record between pages...");
					recordBroken = true;
					lastQtyCapture = null;
					lastNameCapture = null;
					break;
				}
				let numberOfWords = value.split(" ").length;
				if (
					!recordBroken &&
					value.length > 7 &&
					numberOfWords > 1 &&
					numberOfWords < 15 &&
					!value.includes(",")
				) {
					if (includesAny(value, ["bond", "bd", "ncd", "debenture"]))
						mode = "B";
					if (lastNameCapture) {
						let diff = j - lastNameCapture;
						if (mode !== "M" && diff < 4) continue;
					}
					value = cleanName(value, [
						"#",
						"(",
						"-",
						"/",
						"NEW RS.",
						"RS.",
						"NEW RE.",
						"RE.",
						"NEW F.V",
						"NEW FV",
					]);
					value = replaceIfFound(value, [
						"LIMITED",
						"EQUITY",
						"EQ",
						"LTD",
						"SHARES",
						"Beneficiary",
						"PVT",
					]);
					value = replaceIfFound(value, [" AND", " OF", " &"], "", true);
					if (!value) continue;
					if (
						mode === "M" &&
						name &&
						lastNameCapture &&
						j - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					if (mode === "M") {
						name = removeDuplicates(name as string);
						name = cleanName(name as string, ["(", ")"]);
					}
					lastNameCapture = j;
					quantity = null;
					lastQtyCapture = null;
					console.log("Detected name: ", name);
					if (!checkMultipleValues) continue;
				}
				let qty: number | null = getQty(value, mode === "M");
				if (!qty) continue;
				if (!recordBroken && lastQtyCapture && j - lastQtyCapture < 7) continue;
				recordBroken = false;
				if (hasFV && !fv && mode === "E") {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
				console.log("Detected quantity: ", qty);
				lastQtyCapture = j;
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
