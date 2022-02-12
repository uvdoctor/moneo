import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { text },
  } = req;
  const eodKey = "61ff9bf3d40797.93512142";

  try {
    const response = await fetch(
      `https://eodhistoricaldata.com/api/search/${text}?api_token=${eodKey}`
    );
    const data = await response.json();

    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
