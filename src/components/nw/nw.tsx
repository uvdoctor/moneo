import React, { useState } from "react";
import {
	Upload,
	Empty,
	notification,
	Modal,
	Input,
	Drawer,
	Button,
	Row,
} from "antd";
import { InboxOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as pdfjsLib from "pdfjs-dist";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { appendValue, cleanName, includesAny, replaceIfFound } from "../utils";
import HoldingTabs from "./HoldingTabs";

import "./nw.less";

const isValidISIN = (val: string) =>
	val.length === 12 && val.startsWith("IN") && !val.includes(" ");

const isValidPAN = (val: string) =>
	val.length === 10 &&
	!val.includes(" ") &&
	val.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);

const contains = (val: string, type: string = "ISIN") => {
	let values = val.split(" ");
	for (let value of values) {
		value = value.trim();
		if (type === "PAN") {
			value = replaceIfFound(value, ["pan", ":", "(", ")"]);
		}
		if (type === "ISIN" ? isValidISIN(value) : isValidPAN(value)) return value;
	}
	return null;
};

const getISIN = (val: string) => {
	if (val.length < 12) return null;
	if (isValidISIN(val)) return val;
	return null;
};

const getQty = (val: string, isMF: boolean = false) => {
	val = val.replace(/,/g, "");
	let result = parseInt(val);
	if (Number.isNaN(result)) return null;
	if (val.includes(".")) {
		let wholeNum = val.split(".")[0];
		let decimals = val.split(".")[1];
		if (wholeNum.length > 5) return null;
		if (decimals.length > 3) return null;
		let result = Number(parseFloat(val).toFixed(3));
		if (Number.isNaN(result)) return null;
		if (!isMF && decimals && parseInt(decimals)) return null;
		return result;
	} else {
		if (val.length > 6) return null;
		return result;
	}
};

const hasHoldingStarted = (value: string) =>
	includesAny(value, [
		"holding statement",
		"holding as of",
		"holding as on",
		"holdings",
		"balances as of",
		"balances as on",
		"no transaction",
	]);

export default function NW() {
	const fsb = useFullScreenBrowser();
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [fileParsing, setFileParsing] = useState<boolean>(false);
	const [showUpdateHoldings, setUpdateHoldings] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const [taxId, setTaxId] = useState<string>("");

	const { confirm } = Modal;
	const { Dragger } = Upload;
	const uploaderSettings = {
		accept: ".pdf",
		name: "file",
		action: "",
		headers: { "content-type": "application/pdf" },
		customRequest: ({ onSuccess }: any) => {
			setTimeout(() => {
				onSuccess("ok");
			}, 0);
		},
		multiple: false,
		onChange: (info: any) => {
			const { status } = info.file;
			if (status !== "uploading") {
				console.log(info.file, info.fileList);
			}
			if (status === "done") {
				processPDF(info.file.originFileObj);
			} else if (status === "error") {
				notification.error({
					message: "File upload failed",
					description: `Unable to upload ${info.file.name}`,
				});
			}
		},
	};

	const removeDuplicates = (value: string) => {
		let values = value.split(" ");
		for (let i = 2; i < values.length; i++) {
			let v = values[i].trim();
			for (let j = 1; j < i; j++) {
				let token = values[j].trim();
				if (v === token) value = value.replace(token, "");
			}
		}
		return value.trim();
	};

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
		for (let i = 1; i <= pdf.numPages; i++) {
			lastNameCapture = null;
			lastQtyCapture = null;
			if (!recordBroken) {
				isin = null;
				quantity = null;
				name = null;
			}
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			for (let i = 0; i < textContent.items.length; i++) {
				let value = textContent.items[i].str.trim();
				if (!value.length) continue;
				if (value.trim().length >= 10 && !taxId) {
					taxId = contains(value, "PAN");
					if (taxId) continue;
				}
				if (!holdingStarted) {
					holdingStarted = hasHoldingStarted(value);
					continue;
				}
				if (value.length > 100) continue;
				if (includesAny(value, ["commission paid", "end of statement"])) break;
				if (hasData && includesAny(value, ["transaction statement"])) break;
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
						"equities",
						"listed",
						"not ",
						"value (",
						"value in",
						"free b",
					])
				)
					continue;
				let retVal = getISIN(value);
				if (!retVal) {
					retVal = contains(value);
					checkMultipleValues = true;
				}
				if (retVal) {
					if (lastQtyCapture && i - lastQtyCapture > 9) {
						console.log("Detected unrelated qty capture: ", lastQtyCapture);
						quantity = null;
						lastQtyCapture = null;
					}
					console.log("Detected ISIN: ", retVal);
					isin = retVal;
					mode = isin.startsWith("INF") ? "M" : "E";
					if (isin && quantity) {
						if (lastNameCapture && i - lastNameCapture > 9) {
							console.log("Detected unrelated name capture: ", lastNameCapture);
							name = null;
							lastNameCapture = null;
						}
						console.log("Record completed...");
						hasData = true;
						appendValue(
							mode === "E" ? equities : mode === "M" ? mfs : bonds,
							isin,
							quantity
						);
						if (!insNames[isin]) insNames[isin] = name ? name : isin;
						isin = null;
						quantity = null;
						name = null;
					}
					if (!checkMultipleValues) continue;
				}
				if (quantity) continue;
				if (!isin && value.toLowerCase().includes("page")) continue;
				if (
					isin &&
					value.toLowerCase().includes("page") &&
					i - textContent.items.length < 5
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
					numberOfWords < 12 &&
					!value.includes(",")
				) {
					if (includesAny(value, ["bond", "bd"])) mode = "B";
					if (lastNameCapture) {
						let diff = i - lastNameCapture;
						if (mode !== "M" && diff < 5) continue;
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
						" EQ",
						" LTD",
						" SHARES",
						"Beneficiary",
					]);
					value = replaceIfFound(value, [" AND", " OF", " &"], "", true);
					if (!value) continue;
					if (
						mode === "M" &&
						name &&
						lastNameCapture &&
						i - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					if (mode === "M") {
						name = removeDuplicates(name as string);
						name = cleanName(name as string, ["(", ")"]);
					}
					lastNameCapture = i;
					quantity = null;
					lastQtyCapture = null;
					console.log("Detected name: ", name);
					if (!checkMultipleValues) continue;
				}
				let qty: number | null = getQty(value, mode === "M");
				if (!qty) continue;
				if (!recordBroken && lastQtyCapture && i - lastQtyCapture < 7) continue;
				recordBroken = false;
				if (hasFV && !fv && mode === "E") {
					console.log("Detected fv: ", qty);
					fv = qty;
					continue;
				}
				console.log("Detected quantity: ", qty);
				lastQtyCapture = i;
				quantity = qty;
				if (hasFV) fv = null;
				if (isin && quantity) {
					if (recordBroken || (lastNameCapture && i - lastNameCapture > 9)) {
						lastNameCapture = null;
						recordBroken = false;
					}
					console.log("Record completed...");
					hasData = true;
					appendValue(
						mode === "E" ? equities : mode === "M" ? mfs : bonds,
						isin,
						quantity
					);
					if (!insNames[isin]) insNames[isin] = name ? name : isin;
					isin = null;
					quantity = null;
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

	const processPDF = (file: File) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
			const pdfLoadingTask = pdfjsLib.getDocument({
				data: new Uint8Array(reader.result as ArrayBuffer),
			});
			pdfLoadingTask.onPassword = async (
				pwdHandler: Function,
				response: any
			) => {
				const retVal = await getPDFPassword(
					response === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
						? "Invalid Password. Please try again."
						: "Password"
				);
				if (retVal) pwdHandler(retVal);
				else {
					setFileParsing(false);
				}
			};
			pdfLoadingTask.promise.then(async (pdf) => {
				setFileParsing(true);
				await parseHoldings(pdf);
				setFileParsing(false);
			});
		};
		reader.onerror = (error: any) =>
			notification.error({
				message: "Error while reading file",
				description: error,
			});
	};

	const getPDFPassword = (title: string) => {
		return new Promise((resolve, reject) => {
			confirm({
				title,
				icon: <ExclamationCircleOutlined />,
				content: (
					<Input
						id="pdf-password"
						placeholder="Enter PDF password..."
						onPressEnter={(e: any) => {
							resolve(e.currentTarget.value);
							Modal.destroyAll();
						}}
					/>
				),
				onOk: () => {
					// @ts-ignore
					const password = document.getElementById("pdf-password").value;
					resolve(password);
				},
				onCancel: () => {
					reject("Cancel");
				},
			});
		});
	};

	const hasNoHoldings = () =>
		!Object.keys(allBonds).length &&
		!Object.keys(allEquities).length &&
		!Object.keys(allMFs).length;

	/*useEffect(() => {
		fetch('/api/price', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				isin: 'IN'
			})
		});
	}, []);*/

	function onCloseUpdateHoldings() {
		setUpdateHoldings(false);
	}

	return (
		<div className="nw-container">
			<Dragger {...uploaderSettings}>
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
			{!fileParsing && !hasNoHoldings() ? (
				<>
					<Drawer
						className="upload-holdings-drawer"
						width={isMobileDevice(fsb) ? 320 : 320}
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
					<HoldingTabs
						equities={allEquities}
						bonds={allBonds}
						mutualFunds={allMFs}
						insNames={insNames}
					/>
				</>
			) : (
				!fileParsing && <Empty description={<p>No investment data.</p>} />
			)}
		</div>
	);
}
