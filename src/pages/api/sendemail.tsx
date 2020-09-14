import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    status: string
}
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.log("Req method: ", req.method);
  res.status(200).json({status: 'done'})
};
