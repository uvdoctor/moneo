import React from 'react';
import { NWContextProvider } from '../components/nw/NWContext';
import Amplify from 'aws-amplify';
import awsexports from '../aws-exports';
import BasicPage from '../components/BasicPage';
import { InferGetStaticPropsType } from 'next';
import { defaultFXRates } from '../components/utils';

Amplify.configure({ ...awsexports, ssr: true });

function Get({ fxRates }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<BasicPage title="Moneo - Get" secure>
			<NWContextProvider fxRates={fxRates} />
		</BasicPage>
	);
}

export async function getStaticProps() {
	const currencyList = Object.keys(defaultFXRates);
	for (let curr of currencyList) {
    try {
		const data = await fetch(
			`https://eodhistoricaldata.com/api/real-time/${curr}.FOREX?api_token=60d03a689523a3.63944368&fmt=json`
		);
    const response = await data.json();
		defaultFXRates[curr] = response.close;
    } catch {
			break;
    }
	}
	let fxRates = defaultFXRates;
	return {
		props: {
			fxRates
		}
	};
}

export default Get;
