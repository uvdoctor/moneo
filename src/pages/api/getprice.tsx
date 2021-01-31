import { NextApiRequest, NextApiResponse } from 'next';
import { finnhub } from 'finnhub';

type Data = {
  success: boolean;
  price: number;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { query: { token }, method } = req;
	console.log('Going to recaptcha with token: ', token);
	if (method === 'POST') {
		const api_key = finnhub.ApiClient.instance.authentications['api_key'];
		api_key.apiKey = "c024huv48v6vllnqorng"
		const finnhubClient = new finnhub.DefaultApi()
		console.log(finnhubClient);
		// fetch('https://www.google.com/recaptcha/api/siteverify', {
			// method: 'POST',
			// headers: {
			// 	'Content-Type': 'application/json;charset=utf-8'
			// },
			// body: JSON.stringify({
			// 	secret: secret,
			// 	response: token
			// })
    // }).then(() => 
    {
			res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ success: true, price: 1300.50 });
		};
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};