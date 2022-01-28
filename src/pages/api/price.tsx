import { NextApiRequest, NextApiResponse } from 'next';
import { defaultPrices } from '../../components/utils';

type Data = {
	rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { method, body: { id, type, currency } } = req;
	const apiKeys = [ '611a020d72d487.59800610', '611a01dc0083c5.1967043', '61f26f046a8311.03934960' ];

	const getCryptoRate = () => {
		fetch(`https://api.coinbase.com/v2/prices/${id}-${currency}/sell`)
			.then((data) =>
				data.json().then((response) => {
					console.log(response.data.amount);
					res.status(200).json({ rate: response.data.amount });
				})
			)
			.catch((err) => {
				console.log(`Error while getting coinbase price for ${id} due to ${err}`);
				res.status(200).json({ rate: defaultPrices[id] });
			});
	};

	const getCommodityRate = (index: number) => {
		let token = apiKeys[index];
		fetch(`https://eodhistoricaldata.com/api/real-time/${id}.${type}?api_token=${token}&fmt=json`)
			.then((data) =>
				data.json().then((response) => {
					console.log(response);
					res.status(200).json({ rate: response.close });
				})
			)
			.catch((err) => {
				console.log(`Error while getting eod price for ${id} due to ${err}`);
				if (index <= apiKeys.length - 1) {
					index++;
					getCommodityRate(index);
				} else {
					res.status(200).json({ rate: defaultPrices[id] });
				}
			});
	};
	if (method === 'POST') {
		type === 'CC' ? getCryptoRate() : getCommodityRate(0);
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
