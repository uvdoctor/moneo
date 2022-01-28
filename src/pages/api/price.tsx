import { NextApiRequest, NextApiResponse } from 'next';
import { defaultPrices } from '../../components/utils';

type Data = {
	rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { method, body: { id, type } } = req;
	const apiKeys = [ '611a020d72d487.59800610', '611a01dc0083c5.1967043', '61f26f046a8311.03934960' ];
	const getCryptoRate = (index: number) => {
		let name =  type === "CC" ? id+'-USD' : id;
		let token = apiKeys[index];
		fetch(`https://eodhistoricaldata.com/api/real-time/${name}.${type}?api_token=${token}&fmt=json`)
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
					getCryptoRate(index);
				} else {
					res.status(200).json({ rate: defaultPrices[id] });
				}
			});
	};
	if (method === 'POST') {
		getCryptoRate(0);
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
