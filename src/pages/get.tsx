import React from 'react';
import { NWContextProvider } from '../components/nw/NWContext';
import Amplify from 'aws-amplify';
import awsexports from '../aws-exports';
import BasicPage from '../components/BasicPage';
import { InferGetStaticPropsType } from 'next';
import { currencyListToCall } from '../components/utils';

Amplify.configure({ ...awsexports, ssr: true });

function Get({ ratesData }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<BasicPage title="Moneo - Get" secure>
			<NWContextProvider ratesData={ratesData} />
		</BasicPage>
	);
}

export async function getStaticProps() {
	let ratesData: { [key: string]: number } = {};
	const token = '60d03a689523a3.63944368';
	for (let curr of currencyListToCall) {
    let response;
    try {
		const data = await fetch(
			`https://eodhistoricaldata.com/api/real-time/${curr}.FOREX?api_token=${token}&fmt=json`
		);
    response = await data.json();
    } catch {
      response = null;
    }
		ratesData[curr] = response ? response.close : 0;
	}
	
	return {
		props: {
			ratesData
		}
	};
}

export default Get;
