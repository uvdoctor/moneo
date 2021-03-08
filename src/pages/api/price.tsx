import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  price: Number[];
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { body: { isin }, method } = req;
	console.log('Going to get data for isin: ', isin);
	if (method === 'POST') {
		fetch('https://finnhub.io/api/v1/search?q=IN&token=sandbox_c024huv48v6vllnqoro0')
			.then(res => res.json()).then(data => console.log(data))
			.catch(error => console.log("Error while fetching from finnhub: ", error));
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};