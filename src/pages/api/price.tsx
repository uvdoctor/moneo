import { NextApiRequest, NextApiResponse } from "next";
import { defaultPrices } from "../../components/utils";

type Data = {
  rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    method,
    body: { id, type },
  } = req;
  const eodKey = "61ff9bf3d40797.93512142";

  const getRate = (id: string, type: string) => {
    fetch(`https://eodhistoricaldata.com/api/eod/${id}.${type}?api_token=${eodKey}&fmt=json&filter=last_close`)
      .then((data) => data.json())
      .then((rate) => res.status(200).json({ rate: rate }))
      .catch((err) => {
        console.log(`Error while getting eod price for ${id} due to ${err}`);
        res.status(200).json({ rate: defaultPrices[id] });
      });
  };

  const getCryptolist = () => {
    fetch(`https://eodhistoricaldata.com/api/exchange-symbol-list/CC?api_token=${eodKey}&fmt=json`)
      .then((data) => data.json())
      .then((resp) => {
        const list: { code: any; name: any, value: any }[] = [];
        resp.map((item: any) => list.push({code: item.Code, name: item.Name, value: item.Name}))
        // @ts-ignore
        res.status(200).json(list)
      })
      .catch((err) => {
        console.log(`Error while getting crypto list due to ${err}`);
        // @ts-ignore
        res.status(200).json([]);
      });
  };

  if (method === "POST") {
    (!id || !type) ? getCryptolist() : getRate(id, type)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
