const juice = require("juice");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient({ apiVersion: "2010-12-01" });
const PRICE_TEMPLATE_NAME = "pricealerts";
const WATCH_TEMPLATE_NAME = "watchalerts";
const resolved = (fileName) => path.resolve(__dirname, fileName)
const senderAddress = "noreply <no-reply@comms.moneo.in>";
let preCompiledTemplates = {};
const partialsPath = resolved("./partials");

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
  const path = resolved(`./templates/${templateName}/${partName}.hbs`);
  if (!preCompiledTemplates[path]) {
    const template = await fs.promises.readFile(
      resolved(`./templates/${templateName}/${partName}.hbs`)
    );
    preCompiledTemplates[path] = handlebars.compile(template.toString());
  }
  return preCompiledTemplates[path](values);
};

const sendEmail = async ({ templateName, email, values }) => {
  
  console.log(path.resolve("./email.css"));
  console.log(path.resolve("./partials"));
  registerPartials(partialsPath);
  handlebars.registerHelper("title", function (templateName) {
    switch (templateName) {
      case PRICE_TEMPLATE_NAME: return "Investment Valuation";
      case WATCH_TEMPLATE_NAME: return "Buy / Sell Alerts";
      default: return "";
    }
  });
  console.log(templateName, email, values);
  const [html, text, subject] = await Promise.all([
    renderTemplate(templateName, "html", values),
    renderTemplate(templateName, "text", values),
    renderTemplate(templateName, "subject", values),
  ]);

  const juiceOptions = {
    extraCss: fs.readFileSync(resolved("./email.css")).toString(),
  };

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

module.exports = { sendEmail, PRICE_TEMPLATE_NAME, WATCH_TEMPLATE_NAME };
