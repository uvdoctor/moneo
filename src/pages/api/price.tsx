import { NextApiRequest, NextApiResponse } from "next";
import { defaultPrices, getCustomDate } from "../../components/utils";

type Data = {
  rate: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    method,
    body: { id, type, isPrev },
  } = req;
  const eodKey = "61ff9bf3d40797.93512142";

  const getRate = (id: string, type: string) => {
    fetch(
      `https://eodhistoricaldata.com/api/real-time/${id}.${type}?api_token=${eodKey}&fmt=json&filter=close`
    )
      .then((data) => data.json())
      .then((rate) => res.status(200).json({ rate: rate }))
      .catch((err) => {
        console.log(`Error while getting eod price for ${id} due to ${err}`);
        res
          .status(200)
          .json({ rate: defaultPrices[id] ? defaultPrices[id] : 0 });
      });
  };

  let prev = 1;
  const getPrevRate = async (id: string, type: string) => {
    const date = getCustomDate(prev);
    fetch(
      `https://eodhistoricaldata.com/api/eod/${id}.${type}?api_token=${eodKey}&fmt=json&from=${date}&filter=close`
    )
      .then((data) => data.json())
      .then((rate) => {
        if ((!Array.isArray(rate) || !rate?.length) && prev <= 5) {
          prev++;
          getPrevRate(id, type);
        } else {
          res.status(200).json({ rate: rate[1] });
        }
      })
      .catch((err) => {
        console.log(
          `Error while getting eod previos day price for ${id} due to ${err}`
        );
        res
          .status(200)
          .json({ rate: defaultPrices[id] ? defaultPrices[id] : 0 });
      });
  };

  const getCryptolist = () => {
    fetch(
      `https://eodhistoricaldata.com/api/exchange-symbol-list/CC?api_token=${eodKey}&fmt=json`
    )
      .then((data) => data.json())
      .then((resp) => {
        const list: { code: any; name: any; value: any }[] = [];
        resp.map((item: any) => {
          const name = `${item.Name} - ${item.Code}`;
          list.push({ code: item.Code, name, value: name });
        });
        // @ts-ignore
        res.status(200).json(list);
      })
      .catch((err) => {
        console.log(`Error while getting crypto list due to ${err}`);
        // @ts-ignore
        res.status(200).json([]);
      });
  };

  if (method === "POST") {
    !id || !type
      ? getCryptolist()
      : isPrev
      ? getPrevRate(id, type)
      : getRate(id, type);
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
