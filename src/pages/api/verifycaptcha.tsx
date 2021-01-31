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
			if(!data || !data.score || !data.success){
				res.status(500).end('Google captcha failed');
			}
			let isBot = (data.score < 0.5);
			if(isBot){
				res.status(403).json({ success: false });
			}else{
				res.status(200).json({ success: true });
			}
			res.setHeader('Content-Type', 'application/json');
		})
		.catch((e: any) => {
			console.log("ERROR", e);
			res.status(500).end('Google captcha Exception');
		});
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
