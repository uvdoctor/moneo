import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    method,
    body: { id },
  } = req;
  if (method === "POST") {
    fetch(
      `https://eodhistoricaldata.com/api/real-time/${id}?api_token=60d03a689523a3.63944368&fmt=json`
    )
      .then((data) =>
        data.json().then((response) => {
          res.status(200).json({ rate: response.close });
        })
      )
      .catch((err) => {
        console.log(`Error while getting eod price for ${id} due to ${err}`);
        let defaultVal = 0;
        res.status(200).json({ rate: defaultVal });
      });
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
