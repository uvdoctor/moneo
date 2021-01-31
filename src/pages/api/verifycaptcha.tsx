import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body: {token} } = req;
	const secret = '6LdTyd8ZAAAAAEB3B2-P2swyDqrqpBQEcY4m0sOf';
	if (method === 'POST') {
		fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `secret=${secret}&response=${token}`
		}).then((captchRes: any) => 
			captchRes.json()
		).then((data: any) => {
			console.log('Server response: ', data.score);
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({ success: data.success });
		})
		.catch((e: any) => {
			console.log("ERROR", e);
		});
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
