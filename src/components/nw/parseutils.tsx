import { Modal, notification, Input } from "antd";
import * as pdfjsLib from "pdfjs-dist";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

export const extractISIN = (val: string) => {
  val = val.trim();
  if (!val.length || val.length < 12) return null;
  let isinStr = val.substring(0, 12);
  if (isValidISIN(isinStr)) return isinStr;
  return null;
};

const isValidISIN = (val: string) => val.match(/^[A-Z]{2}([A-Z0-9]){9}[0-9]$/);

export const isValidPAN = (val: string) =>
  val.length === 10 &&
  !val.includes(" ") &&
  val.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);

export const extractPAN = (val: string) => {
  let values = val.split(" ");
  for (let value of values) {
    if (value.length < 10) continue;
    for (let i = 0; i < value.length; i++) {
      let asciiVal = value.charCodeAt(i);
      if (asciiVal > 64 && asciiVal < 91 && value.length - i > 9) {
        let panStr = value.substring(i, i + 10);
        if (isValidPAN(panStr)) return panStr;
      }
    }
  }
  return null;
};

export const getQty = (val: string) => {
  val = val.replace(/,/g, "");
  let result = parseInt(val);
  if (Number.isNaN(result)) {
    val = val.trim();
    if (val === "--") return 0;
    return null;
  }
  if (result < 0) return null;
  if (result === 0) return 0;
  if (!val.includes(".")) return val.length > 6 || !result ? null : result;
  let numbers = val.split(".");
  if (numbers.length > 2) return null;
  if (numbers[0].length > 6 || numbers[1].length > 3) return null;
  return parseFloat(val);
};

const processPDF = (file: File, parsePDF: Function) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const pdfLoadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(reader.result as ArrayBuffer),
    });
    pdfLoadingTask.onPassword = async (pwdHandler: Function, response: any) => {
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
  };
};
