import { NextApiRequest, NextApiResponse } from "next";
import { defaultPrices } from "../../components/utils";

type Data = {
  rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    method,
    body: { id, type, currency },
  } = req;
  const eodKey = "61ff9bf3d40797.93512142";

  const getCryptoRate = () => {
    fetch(`https://api.coinbase.com/v2/prices/${id}-${currency}/sell`)
      .then((data) => data.json())
      .then((response) => res.status(200).json({ rate: response.data.amount }))
      .catch((err) => {
        console.log(
          `Error while getting coinbase price for ${id} due to ${err}`
        );
        res.status(200).json({ rate: defaultPrices[id] });
      });
  };

  const getCommodityRate = () => {
    fetch(
      `https://eodhistoricaldata.com/api/eod/${id}.${type}?api_token=${eodKey}&fmt=json&filter=last_close`
    )
      .then((data) => data.json())
      .then((rate) => res.status(200).json({ rate: rate }))
      .catch((err) => {
        console.log(`Error while getting eod price for ${id} due to ${err}`);
        res.status(200).json({ rate: defaultPrices[id] });
      });
  };
  if (method === "POST") {
    type === "CC" ? getCryptoRate() : getCommodityRate();
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
