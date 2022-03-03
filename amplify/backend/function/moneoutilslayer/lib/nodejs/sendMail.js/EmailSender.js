const juice = require("juice");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient({ apiVersion: "2010-12-01" });

const senderAddress = "noreply <no-reply@moneo.money>";
const juiceOptions = {
  extraCss: fs.readFileSync("./email.css").toString(),
};
let preCompiledTemplates = {};
const partialsPath = "./partials";

const registerPartials = (partialsPath) => {
  for (let template of fs.readdirSync(partialsPath)) {
    if (template.endsWith(".hbs")) {
      const name = template.split(".")[0];
      handlebars.registerPartial(
        name,
        fs.readFileSync(path.join(partialsPath, template)).toString()
      );
    }
  }
};

const performSend = async (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await client.send(new SendEmailCommand(request));
      console.log(data);
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const renderTemplate = async (templateName, partName, values) => {
  const path = `./templates/${templateName}/${partName}.hbs`;
  if (!preCompiledTemplates[path]) {
    const template = await fs.promises.readFile(
      `./templates/${templateName}/${partName}.hbs`
    );
    preCompiledTemplates[path] = handlebars.compile(template.toString());
  }
  return preCompiledTemplates[path](values);
};

const send = async ({ templateName, email, values }) => {
  registerPartials(partialsPath);
  console.log(templateName, email, values);
  const [html, text, subject] = await Promise.all([
    renderTemplate(templateName, "html", values),
    renderTemplate(templateName, "text", values),
    renderTemplate(templateName, "subject", values),
  ]);

  const request = {
    Source: senderAddress,
    Destination: {
      ToAddresses: Array.isArray(email) ? email : [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: juice(html, juiceOptions),
        },
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  console.log(request);
  await performSend(request);
};

module.exports = { send };
