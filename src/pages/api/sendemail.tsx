import { NextApiRequest, NextApiResponse } from 'next';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
/*
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '47ae7a3be02a49689265afcb4f720a75',
  captureUncaught: true,
  captureUnhandledRejections: true
});

rollbar.log('rollbar doesn't work inside promise.then');
*/
const client = new SESClient({
  region: 'us-east-1' ,
  apiVersion: '2010-12-01',
  credentials: {
    'accessKeyId': "AKIAROHCVNGYBO5Y6IPU",
    'secretAccessKey': "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",
  }
});

type Data = {
    status: string
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method, body: {template}, body: {subject} } = req;
  if (method === 'POST') {
    const params = {
      Destination: {
        ToAddresses: [ "emailumangdoctor@gmail.com" ]
      },
      Source: "no-reply@moneo.money",
      Message: {
        Body: {
         Html: {
          Charset: "UTF-8",
          Data: template
         }
        }, 
        Subject: {
         Charset: "UTF-8", 
         Data: `Moneo Feedback - ${subject}`,
        }
       }, 
    };
    client.send(new SendEmailCommand(params))
      .then((data) => {
        console.log('Mail sent with id = '+data.MessageId);
        res.status(200).json({status: 'Mail sent with id = '+data.MessageId});
      })
      .catch((error) => {
        console.error('Mail send error: ' + error);
        res.status(200).json({status: 'Error when sending mail: '+error})
      })
    } else {
      res.status(405).end(`Method ${method} Not Allowed`);
    }
};
