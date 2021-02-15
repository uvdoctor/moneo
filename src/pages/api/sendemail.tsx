import { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

type Data = {
    status: string
}
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method, body: {to}, body: {from}, body: {template}, body: {templateData} } = req;
  console.log('Sending mail template =',template,', with templateData =',templateData);
  if (method === 'POST') {
    const params = {
      Destination: {
        ToAddresses: [ to ]
      },
      Template: template, //name of SES template
      TemplateData: JSON.stringify(templateData),
      Source: '21.ramit@gmail.com',
      ReplyToAddresses: [ from ]
    };
    const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
    sendPromise
      .then(function(data) {
        res.status(200).json({status: 'Mail sent with id = '+data.MessageId})
      })
      .catch(function(err) {
        console.error('Mail send error', err, err.stack);
        res.status(200).json({status: 'Error when sending mail'})
      });
    } else {
      res.status(405).end(`Method ${method} Not Allowed`);
    }
};
