import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  price: Number[];
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { body: { url } } = req;
  const googleOAuthId = '1017151147601-s7mh9osmkajm4dg2pevtu76ck62dt4up.apps.googleusercontent.com';
  const googleOAuthSecret = 'uMTkr7I9AvRbGdgMGj7FBBgH';

	console.log('Going to get data for file: ', url);
	fetch('https://finnhub.io/api/v1/search?q=IN&token=sandbox_c024huv48v6vllnqoro0')
			.then(res => res.json()).then(data => console.log(data))
			.catch(error => console.log("Error while fetching from finnhub: ", error));
	res.status(200).end('Message received');
};