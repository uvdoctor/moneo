import { NextApiRequest, NextApiResponse } from 'next';

const returnCaptchaResponse = async(token: any, res: NextApiResponse) => {
	const secret = '6LdTyd8ZAAAAAEB3B2-P2swyDqrqpBQEcY4m0sOf';
	fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `secret=${secret}&response=${token}`
	}).then((captchRes: any) => 
		captchRes.json()
	).then((data: any) => {
		res.setHeader('Content-Type', 'application/json');
		if(!data || !data.score || !data.success){
			res.status(500).end('Google captcha failed');
		}
		if(data.score < 0.5){
			res.status(403).json({ success: false });
		}else{
			res.status(200).json({ success: true });
		}
	})
	.catch((e: any) => {
		console.log("ERROR", e);
		res.status(500).end('Google captcha Exception');
	});
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body: {token} } = req;
	if (method === 'POST') {
		await returnCaptchaResponse(token, res);
	} else {
		res.status(405).end(`Method ${method} Not Allowed`);
	}
};
