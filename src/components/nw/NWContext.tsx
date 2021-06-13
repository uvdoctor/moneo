import React, { createContext, ReactNode, useContext, useState } from "react";
import "./nw.less";
import HoldingsDetails from "./HoldingsDetails";
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
import { AppContext } from "../AppContext";
import { getAllFamilyMembers } from "./nwutils";

const NWContext = createContext({});

function NWContextProvider() {
	const { defaultCurrency }: any = useContext(AppContext);
	const [allFamily, setAllFamily] = useState<any>(getAllFamilyMembers());
	const [selectedMember, setSelectedMember] = useState<string>("all");
	const [selectedCurrency, setSelectedCurrency] = useState<string>(
		defaultCurrency
	);
	const [allEquities, setAllEquities] = useState<any>({});
	const [allBonds, setAllBonds] = useState<any>({});
	const [allMFs, setAllMFs] = useState<any>({});
	const [allETFs, setAllETFs] = useState<any>({});
	const [allProperties, setAllProperties] = useState<any>({});
	const [allVehicles, setAllVehicles] = useState<any>({});
	const [allSavings, setAllSavings] = useState<any>({});
	const [allDeposits, setAllDeposits] = useState<any>({});
	const [allPreciousMetals, setAllPreciousMetals] = useState<any>({});
	const [allNPS, setAllNPS] = useState<any>({});
	const [allLendings, setAllLendings] = useState<any>({});
	const [allLoans, setAllLoans] = useState<any>({});
	const [allEPF, setAllEPF] = useState<any>({});
	const [allPPF, setAllPPF] = useState<any>({});
	const [allInsurance, setAllInsurance] = useState<any>({});
	const [allCrypto, setAllCrypto] = useState<any>({});
	const [nw, setNW] = useState<number>(0);
	const [totalAssets, setTotalAssets] = useState<number>(0);
	const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
	const [showUpdateHoldings, setUpdateHoldings] = useState<boolean>(false);
	const [insNames, setInsNames] = useState<any>({});
	const [taxId, setTaxId] = useState<string>("");
	const [activeTab, setActiveTab] = useState<string>("Demat Holdings");
	const [activeTabSum, setActiveTabSum] = useState<number>(0);
	const [holdingsResult, setHoldingsResult] = useState<ReactNode | null>(null);
	const allTabs = {
		"Demat Holdings": {
			label: "Demat Holdings",
			hasUploader: true,
			childrens: [
				{
					label: "Equities",
					data: allEquities,
					total: 0,
				},
				{
					label: "Bonds",
					data: allBonds,
					total: 0,
				},
				{
					label: "Mutual Funds",
					data: allMFs,
					total: 0,
				},
				{
					label: "ETFs",
					data: allETFs,
					total: 0,
				},
			],
		},
		Properties: {
			label: "Properties",
			data: allProperties,
			formConfig: [
				{
					label: "Name",
					name: "name",
					type: "text",
				},
				{
					label: "Qty",
					name: "qty",
					type: "text",
				},
			],
		},
		Vehicles: {
			label: "Vehicles",
			data: allVehicles,
		},
		"Precious Metals": {
			label: "Precious Metals",
			data: allPreciousMetals,
		},
		Deposits: {
			label: "Deposits",
			data: allDeposits,
		},
		Savings: {
			label: "Savings",
			data: allSavings,
		},
		PPF: {
			label: "PPF",
			data: allPPF,
		},
		EPF: {
			label: "EPF",
			data: allEPF,
		},
		NPS: {
			label: "NPS",
			data: allNPS,
		},
		Loans: {
			label: "Loans",
			data: allLoans,
			formConfig: [
				{
					label: "Bank Name",
					name: "bankName",
					type: "text",
				},
				{
					label: "Bank Name",
					name: "bankName",
					type: "slect",
				},
				{
					label: "Amount",
					name: "amount",
					type: "text",
				},
				{
					label: "Duration",
					name: "duration",
					type: "text",
				},
				{
					label: "Interest Rate",
					name: "interestRate",
					type: "text",
				},
			],
		},
		Insurance: {
			label: "Insurance",
			data: allInsurance,
		},
		Lendings: {
			label: "Lendings",
			data: allLendings,
		},
		"Digital Coins": {
			label: "Digital Coins",
			data: allCrypto,
		},
	};

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
		setAllBonds(bonds);
		setAllEquities(equities);
		setAllMFs(mfs);
		setAllETFs(etfs);
		setInsNames(insNames);
		setUpdateHoldings(true);
	};

	const hasNoDematHoldings = () =>
		!Object.keys(allBonds).length &&
		!Object.keys(allEquities).length &&
		!Object.keys(allMFs).length &&
		!Object.keys(allETFs).length;

	function onAddHoldings(formState: any) {
		setAllEquities({
			...allEquities,
			[formState.name.value]: formState.qty.value,
		});
	}

	return (
		<NWContext.Provider
			value={{
				tabs: allTabs,
				activeTab,
				setActiveTab,
				allEquities,
				setAllEquities,
				allBonds,
				setAllBonds,
				allMFs,
				setAllMFs,
				allETFs,
				setAllETFs,
				showUpdateHoldings,
				setUpdateHoldings,
				insNames,
				setInsNames,
				taxId,
				setTaxId,
				hasNoHoldings: hasNoDematHoldings,
				parseHoldings,
				onAddHoldings,
				nw,
				setNW,
				allProperties,
				setAllProperties,
				allPreciousMetals,
				setAllPreciousMetals,
				allDeposits,
				setAllDeposits,
				allNPS,
				setAllNPS,
				totalAssets,
				setTotalAssets,
				totalLiabilities,
				setTotalLiabilities,
				allLoans,
				setAllLoans,
				allEPF,
				setAllEPF,
				allPPF,
				setAllPPF,
				allVehicles,
				setAllVehicles,
				allInsurance,
				setAllInsurance,
				holdingsResult,
				setHoldingsResult,
				allFamily,
				setAllFamily,
				allSavings,
				setAllSavings,
				allLendings,
				setAllLendings,
				allCrypto,
				setAllCrypto,
				selectedMember,
				setSelectedMember,
				selectedCurrency,
				setSelectedCurrency,
				activeTabSum,
				setActiveTabSum,
			}}
		>
			<HoldingsDetails />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
