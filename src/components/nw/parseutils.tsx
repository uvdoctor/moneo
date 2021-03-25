import { Modal, notification, Input } from "antd";
import { appendValue, getValueBefore, includesAny, replaceIfFound } from "../utils";
import * as pdfjsLib from "pdfjs-dist";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export const isValidISIN = (val: string) =>
	val.length === 12 && val.startsWith("IN") && !val.includes(" ");

export const isValidPAN = (val: string) =>
	val.length === 10 &&
	!val.includes(" ") &&
	val.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);

export const contains = (val: string, type: string = "ISIN") => {
	let values = val.split(" ");
	for (let value of values) {
		value = value.trim();
		if (type === "PAN") {
			value = replaceIfFound(value, ["PAN", ":", "(", ")"]);
		}
		if (type === "ISIN" ? isValidISIN(value) : isValidPAN(value)) return value;
	}
	return null;
};

export const getISIN = (val: string) => {
	if (val.length < 12) return null;
	if (isValidISIN(val)) return val;
	return null;
};

export const getQty = (val: string) => {
	val = val.replace(/,/g, "");
	let result = parseInt(val);
	if (Number.isNaN(result)) return null;
	if (result < 0) return null;
	if (!val.includes(".")) 
		return val.length > 6 || !result ? null : result;
	let numbers = val.split(".");
	if (numbers.length > 2) return null;
	if (numbers[0].length > 6 || numbers[1].length > 3) return null;
	return parseFloat(val);
};

export const hasHoldingStarted = (value: string) =>
	includesAny(value, [
		"holding statement",
		"holding as of",
		"holding as on",
		"holdings",
		"holding details",
		"portfolio summary",
		"balances as of",
		"balances as on",
		"no transaction",
	]);

export const removeDuplicates = (value: string) => {
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

export const completeRecord = (recordBroken: boolean, lastNameCapture: number | null, j: number, hasData: boolean, mode: string, equities: any, mfs: any, etfs: any, bonds: any, isin: string | null, quantity: number | null, insNames: any, name: string | null) => {
  if (recordBroken || (lastNameCapture && j - lastNameCapture > 9)) {
    lastNameCapture = null;
    recordBroken = false;
  }
  console.log("Record completed...");
  hasData = true;
  appendValue(
    mode === "E" ? equities : mode === "M" ? mfs : mode === "ETF" ? etfs : bonds,
    isin as string,
    quantity as number
  );
  if (!insNames[isin as string])
    insNames[isin as string] = name ? name : isin;
  isin = null;
  quantity = null;
  return { recordBroken, lastNameCapture, hasData, isin, quantity };
}

const processPDF = (file: File, parsePDF: Function) => {
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
		};
		pdfLoadingTask.promise.then(async (pdf) => {
			await parsePDF(pdf);
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

export const getUploaderSettings = (parsePDF: Function) => {
	return {
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
			if (status === "done") {
				processPDF(info.file.originFileObj, parsePDF);
			} else if (status === "error") {
				notification.error({
					message: "File upload failed",
					description: `Unable to upload ${info.file.name}`,
				});
			}
		},
	}
};

export const cleanAssetName = (val: string) => {
	let value = val.trim();
	value = getValueBefore(value, [
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
		"EQ"
	]);
	value = replaceIfFound(value, [
		"LIMITED",
		"EQUITY",
		"LTD",
		"SHARES",
		"Beneficiary",
		"PVT",
	]);
	value = replaceIfFound(value, [" AND", " OF", " &"], "", true);
	if (!value) return null;
	return value;
}