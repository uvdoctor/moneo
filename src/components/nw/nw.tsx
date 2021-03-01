import { Col, Row, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { appendValue } from '../utils';

const isISIN = (val: string) => val.length === 12 && val.startsWith("IN") && !val.includes(" ");

const getQty = (val: string, isMF: boolean = false) => {
	val = val.replace(/,/g, "");
	let result = parseInt(val);
	if(Number.isNaN(result)) return null;
	if (val.includes(".")) {
		let wholeNum = val.split(".")[0];
		let decimals = val.split(".")[1];
		if (wholeNum.length > 6) return null;
		if (decimals.length > 3) return null;
		if (!isMF) {
			let zeroStr = "0";
			for (let i = 1; i < decimals.length; i++) zeroStr += "0";
			if (!decimals.includes(zeroStr)) return null;
		}
		return parseFloat(val);
	} else {
		if (val.length > 6) return null;
		return result;
	}
}

export default function NW() {
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [fileParsing, setFileParsing] = useState<boolean>(false);
	const { TabPane } = Tabs;

	const parseHoldings = async (pdf: any) => {
		let equities: any = {};
		let mfs: any = {};
		let bonds: any = {};
		let mode = '';
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
				let isin = '';
				for (let i = 0; i < textContent.items.length; i++) {
					let value = textContent.items[i].str.trim();
					if (value.length && value.length < 40 && value.split(" ").length < 5) {
						if (value.includes("Page") || value.includes("Statement")
							|| value.includes("NSDL") || value.includes("Your") ||
							value.includes("Note") || value.includes(":") || value.includes("-"))
							continue;
						if (isISIN(value)) {
							isin = value;
							mode = isin.startsWith('INF') ? 'M' : 'E';
						} else if (isin && value.includes("Bond")) {
							mode = 'B';
						} else if (isin) {
							let qty = getQty(value, mode === 'M');
							if (qty) {
								appendValue(mode === 'E' ? equities : mode === 'B' ? bonds : mfs, isin, qty);
								isin = '';
							}
						}
					}
				}
		}
		setAllBonds(bonds);
		setAllEquities(equities);
		setAllMFs(mfs);
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

	return (
		<Fragment>
		<Row justify="center">
			<Col>
				<input id="fu" type="file" onChange={(event: any) => processPDF(event?.currentTarget.files[0])} accept=".pdf" />
			</Col>
			</Row>
			{!fileParsing &&
				<Tabs defaultActiveKey="E" type="card">
				<TabPane key="E" tab="Equities">
					{Object.keys(allEquities)?.map((key: string, i: number) =>
						<Row key={"stock" + i} justify="center">
							{key}: {allEquities[key]}
						</Row>
					)}
				</TabPane>
				<TabPane key="B" tab="Bonds">
					{Object.keys(allBonds)?.map((key: string, i: number) =>
						<Row key={"bond" + i} justify="center">
							{key}: {allBonds[key]}
						</Row>
					)}
				</TabPane>
				<TabPane key="M" tab="Mutual Funds">
					{Object.keys(allMFs)?.map((key: string, i: number) =>
						<Row key={"mf" + i} justify="center">
							{key}: {allMFs[key]}
						</Row>
					)}
				</TabPane>
			</Tabs>}
		</Fragment>
	);
}
