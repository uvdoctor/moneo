import { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk';
/*
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '47ae7a3be02a49689265afcb4f720a75',
  captureUncaught: true,
  captureUnhandledRejections: true
});

rollbar.log('rollbar doesn't work inside promise.then');
*/

AWS.config.update({
  'accessKeyId': "AKIAROHCVNGYBO5Y6IPU",
  'secretAccessKey': "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",
  'region': 'us-east-1' ,
})

type Data = {
    status: string
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { method, body: {to}, body: {from}, body: {template}, body: {templateData} } = req;
  console.log('Sending mail template =',template,', with templateData =',templateData);
  if (method === 'POST') {
    const params = {
      Destination: {
        ToAddresses: to
      },
      Template: template, //name of SES template
      TemplateData: JSON.stringify(templateData),
      Source: 'no_reply@moneo.money',
      ReplyToAddresses: from
    };
    const sendPromise= new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
    sendPromise
      .then(function(data: any) {
        console.log('Mail sent with id = '+data.MessageId);
        res.status(200).json({status: 'Mail sent with id = '+data.MessageId});
      })
      .catch(function(err: any) {
        console.error('Mail send error: ' + err + err.stack);
        res.status(200).json({status: 'Error when sending mail: '+err.stack})
      });
    } else {
      res.status(405).end(`Method ${method} Not Allowed`);
    }
};
