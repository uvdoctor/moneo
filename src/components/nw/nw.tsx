import { Row, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { appendValue } from '../utils';

const isValidISIN = (val: string) => val.length === 12 && val.startsWith("IN") && !val.includes(" ");

const getISIN = (val: string) => {
	if (val.length < 12 || val.length > 100) return null;
	if (isValidISIN(val)) return val;
	let values = val.split(" ");
	for (let value of values) {
		value = value.trim();
		if (isValidISIN(value)) return value;
	}
	return null;
}

const getQty = (val: string) => {
	val = val.replace(/,/g, "");
	let result = parseInt(val);
	if(Number.isNaN(result)) return null;
	if (val.includes(".")) {
		let wholeNum = val.split(".")[0];
		let decimals = val.split(".")[1];
		if (wholeNum.length > 5) return null;
		if (decimals.length > 3) return null;
		let result = parseFloat(val);
		if (Number.isNaN(result)) return null;
		return result;
	} else {
		if (val.length > 6) return null;
		return result;
	}
}

const hasHoldingStarted = (value: string) => {
	value = value.toLowerCase();
	return value.includes("as on") || value.includes("as of");
};

export default function NW() {
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [fileParsing, setFileParsing] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const { TabPane } = Tabs;

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let mode = '';
		let holdingStarted = false;
		let insNames: any = {};
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			let isin: string | null = null;
			let quantity: number | null = null;
			let name: string | null = null;
			let recordStarted: number | null = null;
			let fv: number | null = null;
			let hasFV = false;
			for (let i = 0; i < textContent.items.length; i++) {
				let value = textContent.items[i].str.trim();
				if (!value.length) continue;
				if (!holdingStarted) {
					holdingStarted = hasHoldingStarted(value);
					continue;
				}
				console.log("Going to check value: ", value);
				let lVal = value.toLowerCase();
				if (lVal.includes("face value")) {
					hasFV = true;
					continue;
				}
				if (lVal.includes("closing ") || lVal.includes("opening ")
					|| lVal.includes("summary") || lVal.includes("year")
					|| lVal.includes("portfolio") || lVal.includes("total")
					|| lVal.includes("asset") || lVal.includes("%")
					|| lVal.includes("Equities"))
					continue;
				let retVal = getISIN(value);
				if (retVal) {
					if (isin && quantity && recordStarted) {
						console.log("Record completed...");
						recordStarted = null;
						appendValue(mode === 'E' ? equities : mode === 'M' ? mfs : bonds, isin, quantity);
						if(!insNames[isin]) insNames[isin] = name ? name : isin;
						quantity = null;
						isin = null;
						name = null;
					}
					if (!isin) {
						console.log("Detected ISIN: ", retVal);
						isin = retVal;
						recordStarted = i;
						quantity = null;
						name = null;
					}
					mode = retVal.startsWith('INF') ? 'M' : 'E';
				} else {
					if (value.includes("Bond")) mode = 'B';
					let numberOfWords = value.split(" ").length;
					if (value.length > 5 && numberOfWords > 1 && numberOfWords < 12) {
						if (isin && quantity && recordStarted) {
							console.log("Record completed...");
							recordStarted = null;
							appendValue(mode === 'E' ? equities : mode === 'M' ? mfs : bonds, isin, quantity);
							if (!insNames[isin]) insNames[isin] = name ? name : isin;
							isin = null;
							quantity = null;
							name = value;
							if (!recordStarted) recordStarted = i;
						} else if (isin || quantity) {
							if (!name) {
								name = value;
							}
						} else {
							name = value;
						}
					} else {
						let qty: number | null = getQty(value);
						if (!qty) continue;
						if (isin && quantity && recordStarted) {
							console.log("Record completed...");
							recordStarted = null;
							appendValue(mode === 'E' ? equities : mode === 'M' ? mfs : bonds, isin, quantity);
							if(!insNames[isin]) insNames[isin] = name ? name : isin;
							isin = null;
							quantity = null;
							name = null;
						}
						if (!quantity || !recordStarted) {
							console.log("Detected quantity: ", qty);
							if (hasFV) {
								if (!fv) {
									fv = qty;
									continue;
								} else {
									quantity = qty;
									fv = null;
								}
							} else quantity = qty;
						}
					}
				}
			}
		}
		setAllBonds(bonds);
		setAllEquities(equities);
		setAllMFs(mfs);
		setInsNames(insNames);
	};

	const processPDF = (file: File) => {
		setFileParsing(true);
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
			const pdfLoadingTask = pdfjsLib.getDocument({ data: new Uint8Array(reader.result as ArrayBuffer) });
			pdfLoadingTask.onPassword = (pwdHandler: Function, response: any) => {
				let retVal =
					prompt(
						response === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
							? 'Invalid Password. Please try again.'
							: 'Password'
					);
				if (retVal) pwdHandler(retVal);
				else {
					setFileParsing(false);
				}
			};
			pdfLoadingTask.promise.then(async (pdf) => {
				await parseHoldings(pdf);
				setFileParsing(false);
			});
		};
		reader.onerror = (error: any) => console.log(error);
	};

	const hasNoHoldings = () => !Object.keys(allBonds).length
		&& !Object.keys(allEquities).length
		&& !Object.keys(allMFs).length;

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
	
	return (
		<Fragment>
			<input id="fu" type="file" onChange={(event: any) => processPDF(event?.currentTarget?.files[0])} accept=".pdf" />
			{!fileParsing && !hasNoHoldings() ?
			<Tabs defaultActiveKey="E" type="card">
				<TabPane key="E" tab="Equities">
					{Object.keys(allEquities)?.map((key: string, i: number) =>
						<Row key={"stock" + i} justify="center">
							{key}: {insNames[key]} - {allEquities[key]}
						</Row>
					)}
				</TabPane>
				<TabPane key="B" tab="Bonds">
					{Object.keys(allBonds)?.map((key: string, i: number) =>
						<Row key={"bond" + i} justify="center">
							{key}: {insNames[key]} - {allBonds[key]}
						</Row>
					)}
				</TabPane>
				<TabPane key="M" tab="Mutual Funds">
					{Object.keys(allMFs)?.map((key: string, i: number) =>
						<Row key={"mf" + i} justify="center">
							{key}: {insNames[key]} - {allMFs[key]}
						</Row>
					)}
				</TabPane>
				</Tabs>
			: !fileParsing && <p>No investment data.</p>}
		</Fragment>
	);
}
