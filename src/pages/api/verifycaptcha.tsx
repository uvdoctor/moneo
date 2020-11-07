import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	success: boolean;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { query: { token }, method } = req;
	const secret = '6LdTyd8ZAAAAAEB3B2-P2swyDqrqpBQEcY4m0sOf';
	console.log('Going to recaptcha with token: ', token);
	if (method === 'POST') {
		fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				secret: secret,
				response: token
			})
		}).then((captchRes: any) => {
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({ success: captchRes.success });
		});
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
