import { Col, Row, Upload } from 'antd';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import * as pdfjsLib from 'pdfjs-dist';
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

export default function NW() {
	const processPDF = async ({ file }: any) => {
		const reader = new FileReader();
		await reader.readAsArrayBuffer(file.originFileObj);
		reader.onload = async () => {
			let uintFile = new Uint8Array(reader.result as ArrayBuffer);
			pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
			const pdfLoadingTask = pdfjsLib.getDocument({ data: uintFile });
			pdfLoadingTask.onPassword = (pwdHandler: Function, response: any) => {
				pwdHandler(
					prompt(
						response === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
							? 'Invalid Password. Please try again.'
							: 'Password'
					)
				);
			};
			pdfLoadingTask.promise.then((pdf) => console.log(pdf));
		};
		reader.onerror = (error: any) => console.log(error);
	};

	return (
		<Row justify="center">
			<Col>
				<Upload action="" listType="text" accept=".pdf" onChange={processPDF}>
					<PlusOutlined />
					<div style={{ marginTop: 8 }}>Upload</div>
				</Upload>
			</Col>
		</Row>
	);
}
