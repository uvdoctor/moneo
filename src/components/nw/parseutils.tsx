import { Modal, notification, Input } from "antd";
import { includesAny } from "../utils";
import * as pdfjsLib from "pdfjs-dist";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AssetSubType, InsType, AssetType } from "../../api/goals";

const { confirm } = Modal;

export const isValidISIN = (val: string) =>
	val.length === 12 && val.startsWith("IN") && !val.includes(" ");

export const isValidPAN = (val: string) =>
	val.length === 10 &&
	!val.includes(" ") &&
	val.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);

export const extractPAN = (val: string) => {
	let values = val.split("PAN");
	if(values.length < 2) return null;
	let value = values[1].trim();
	if(value.length < 10) return null;
	console.log("pan evaluation: ", value);
	for(let i = 0; i < value.length; i++) {
		let asciiVal = value.charCodeAt(i);
		console.log("Ascii val:", asciiVal);
		if(asciiVal > 64 && asciiVal < 91 && (value.length - i > 9)) {
			let panStr = value.substring(i, i + 10);
			console.log("potential pan: ", panStr);
			if(isValidPAN(panStr)) return panStr;
		}
	}
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
		"holding details",
		"as of",
		"as on",
		"holdings"
	]);

export const getInsTypeFromISIN = (isin: string, insType: string | null) => {
	if (isin.startsWith("INF")) {
		if (insType !== InsType.ETF) return 'M';
	} else if (isin.startsWith("IN0")) return AssetType.F;
	else if(isin.startsWith("INE")) return AssetSubType.S;
	return insType;
};

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
		pdfLoadingTask.promise.then(async (pdf: any) => {
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
