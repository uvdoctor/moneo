import React, { useState } from "react";
import {
	Tabs,
	Upload,
	Empty,
	notification,
	Modal,
	Input,
	Drawer,
	Button,
} from "antd";
import { InboxOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as pdfjsLib from "pdfjs-dist";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { appendValue, toReadableNumber } from "../utils";

import "./nw.less";

const isValidISIN = (val: string) =>
	val.length === 12 && val.startsWith("IN") && !val.includes(" ");

const getISIN = (val: string) => {
	if (val.length < 12 || val.length > 100) return null;
	if (isValidISIN(val)) return val;
	let values = val.split(" ");
	for (let value of values) {
		value = value.trim();
		if (isValidISIN(value)) return value;
	}
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

const hasHoldingStarted = (value: string) => {
	value = value.toLowerCase();
	return (
		value.includes("holding statement") ||
		value.includes("holding as of") ||
		value.includes("holding as on") ||
		value.includes("holdings") ||
		value.includes("balances as of") ||
		value.includes("balances as on") ||
		value.includes("no transaction")
	);
};

export default function NW() {
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [fileParsing, setFileParsing] = useState<boolean>(false);
	const [showUpdateHoldings, setUpdateHoldings] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const { TabPane } = Tabs;
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

	const cleanName = (value: string, char: string) =>
		value.split(char)[0].trim();

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
				if (!holdingStarted) {
					holdingStarted = hasHoldingStarted(value);
					continue;
				}
				if (value.length > 100) continue;
				let lVal = value.toLowerCase();
				if (
					lVal.includes("commission paid") ||
					lVal.includes("end of statement")
				)
					break;
				if (lVal.includes("face value")) {
					hasFV = true;
					continue;
				}
				if (
					lVal.includes("closing") ||
					lVal.includes("opening") ||
					lVal.includes("summary") ||
					lVal.includes("year") ||
					lVal.includes("portfolio") ||
					lVal.includes("total") ||
					lVal.includes("%") ||
					lVal.includes("equities") ||
					lVal.includes("listed") ||
					lVal.includes("not ") ||
					lVal.includes("value (") ||
					lVal.includes("value in") ||
					lVal.includes("free b")
				)
					continue;
				let retVal = getISIN(value);
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
					continue;
				}
				if (quantity) continue;
				console.log("Going to check value: ", value);
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
					if (
						value.toLowerCase().includes("bond") ||
						value.toLowerCase().includes("bd")
					) {
						console.log("Detected bond...");
						mode = "B";
					}
					if (lastNameCapture) {
						let diff = i - lastNameCapture;
						if (mode !== "M" && diff < 5) continue;
					}
					value = cleanName(value, "#");
					value = cleanName(value, "(");
					value = cleanName(value, "-");
					value = cleanName(value, "/");
					value = cleanName(value, "NEW RS.");
					value = cleanName(value, "RS.");
					value = cleanName(value, "NEW RE.");
					value = cleanName(value, "RE.");
					value = cleanName(value, "NEW F.V");
					value = cleanName(value, "NEW FV");
					value = value.replace(" LIMITED", "");
					value = value.replace(" EQUITY", "");
					value = value.replace(" EQ", "");
					value = value.replace(" LTD", "");
					value = value.replace(" SHARES", "");
					value = value.trim();
					if (value.endsWith(" AND")) value = value.replace(" AND", "");
					if (value.endsWith(" OF")) value = value.replace(" OF", "");
					if (value.endsWith(" &")) value = value.replace(" &", "");
					if (
						mode === "M" &&
						name &&
						lastNameCapture &&
						i - lastNameCapture <= 2
					)
						name += " " + value.trim();
					else name = value.trim();
					lastNameCapture = i;
					quantity = null;
					lastQtyCapture = null;
					console.log("Detected name: ", name);
					continue;
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
						width={320}
						title="Update holdings"
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
						<Tabs defaultActiveKey="E" type="card">
							<TabPane key="E" tab="Equities">
								{Object.keys(allEquities)?.map((key: string, i: number) => (
									<p key={"stock" + i}>
										{key} - {insNames[key]}: {allEquities[key]}
									</p>
								))}
							</TabPane>
							<TabPane key="B" tab="Bonds">
								{Object.keys(allBonds)?.map((key: string, i: number) => (
									<p key={"bond" + i}>
										{key} - {insNames[key]}: {allBonds[key]}
									</p>
								))}
							</TabPane>
							<TabPane key="M" tab="Mutual Funds">
								{Object.keys(allMFs)?.map((key: string, i: number) => (
									<p key={"mf" + i}>
										{key} - {insNames[key]}:{" "}
										{toReadableNumber(
											allMFs[key],
											("" + allMFs[key]).includes(".") ? 3 : 0
										)}
									</p>
								))}
							</TabPane>
						</Tabs>
					</Drawer>
					<Tabs defaultActiveKey="E" type="card">
						<TabPane key="E" tab="Equities">
							{Object.keys(allEquities)?.map((key: string, i: number) => (
								<p key={"stock" + i}>
									{key} - {insNames[key]}: {allEquities[key]}
								</p>
							))}
						</TabPane>
						<TabPane key="B" tab="Bonds">
							{Object.keys(allBonds)?.map((key: string, i: number) => (
								<p key={"bond" + i}>
									{key} - {insNames[key]}: {allBonds[key]}
								</p>
							))}
						</TabPane>
						<TabPane key="M" tab="Mutual Funds">
							{Object.keys(allMFs)?.map((key: string, i: number) => (
								<p key={"mf" + i}>
									{key} - {insNames[key]}:{" "}
									{toReadableNumber(
										allMFs[key],
										("" + allMFs[key]).includes(".") ? 3 : 0
									)}
								</p>
							))}
						</TabPane>
					</Tabs>
				</>
			) : (
				!fileParsing && <Empty description={<p>No investment data.</p>} />
			)}
		</div>
	);
}
