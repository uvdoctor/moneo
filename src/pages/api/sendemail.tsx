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
  // const { method, body: {to}, body: {from}, body: {template}, body: {templateData} } = req;
  // console.log('Sending mail template =',template,', with templateData =',templateData);
  const { method } = req;
  if (method === 'POST') {
    const params = {
      Destination: {
        ToAddresses: [ "emailumangdoctor@gmail.com" ]
      },
      // Template: template, //name of SES template
      // TemplateData: JSON.stringify(templateData),
      Source: "21.ramit@gmail.com",
      Message: {
        Body: {
         Html: {
          Charset: "UTF-8", 
          Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
         }, 
         Text: {
          Charset: "UTF-8", 
          Data: "This is the message body in text format."
         }
        }, 
        Subject: {
         Charset: "UTF-8", 
         Data: "Test email"
        }
       }, 
       ReplyToAddresses: [ ], 
    };
    client.send(new SendEmailCommand(params))
      .then((data) => {
        console.log('Mail sent with id = '+data.MessageId);
        res.status(200).json({status: 'Mail sent with id = '+data.MessageId});
        // process data.
      })
      .catch((error) => {
        const { requestId, cfId, extendedRequestId } = error.$metadata;
        console.log({ requestId, cfId, extendedRequestId });
        console.error('Mail send error: ' + error);
        res.status(200).json({status: 'Error when sending mail: '+error})
        // error handling.
      })
    } else {
      res.status(405).end(`Method ${method} Not Allowed`);
    }
};
