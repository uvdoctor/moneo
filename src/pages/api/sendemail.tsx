import { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk';
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '47ae7a3be02a49689265afcb4f720a75',
  captureUncaught: true,
  captureUnhandledRejections: true
});

AWS.config.update({ region: 'us-east-1' });

type Data = {
    status: string
}
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method, body: {to}, body: {from}, body: {template}, body: {templateData} } = req;
  console.log('Sending mail template =',template,', with templateData =',templateData);
  rollbar.log('Sending mail template =' + template +', with templateData = '+JSON.stringify(templateData));
  if (method === 'POST') {
    rollbar.log('Sending 0');
    const params = {
      Destination: {
        ToAddresses: to
      },
      Template: template, //name of SES template
      TemplateData: JSON.stringify(templateData),
      //Source: 'no_reply@moneo.money',
      Source: '21.ramit@gmail.com',
      ReplyToAddresses: from
    };
    rollbar.log('Sending 1 '+ params);
    const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
    rollbar.log('Sending 2');
    sendPromise
      .then(function(data: any) {
        rollbar.log('Mail sent with id = '+data.MessageId);
        res.status(200).json({status: 'Mail sent with id = '+data.MessageId});
      })
      .catch(function(err: any) {
        rollbar.log('Mail send error', err, err.stack);
        console.error('Mail send error: ' + err + err.stack);
        res.status(200).json({status: 'Error when sending mail'})
      });
    } else {
      rollbar.log('Sending 3');
      res.status(405).end(`Method ${method} Not Allowed`);
    }
    rollbar.log('Sending 4');
};
