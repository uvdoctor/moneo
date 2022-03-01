const juice = require("juice");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient({ apiVersion: "2010-12-01" });

module.exports = class {
  senderAddress;
  juiceOptions;
  preCompiledTemplates = {};

  constructor(senderAddress, partialsPath = "./partials") {
    this.senderAddress = senderAddress;
    this.juiceOptions = {
      extraCss: fs.readFileSync("./email.css").toString(),
    };
    this.preCompiledTemplates = {};
    this.registerPartials(partialsPath);
  }

  registerPartials = (partialsPath) => {
    console.log(partialsPath);
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

  performSend = async (request) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await client.send(new SendEmailCommand(request));
        console.log(data);
        if (data) resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  };

  renderTemplate = async (templateName, partName, values) => {
    const path = `./templates/${templateName}/${partName}.hbs`;
    if (!this.preCompiledTemplates[path]) {
      const template = await fs.promises.readFile(
        `./templates/${templateName}/${partName}.hbs`
      );
      this.preCompiledTemplates[path] = handlebars.compile(template.toString());
    }
    return this.preCompiledTemplates[path](values);
  };

  send = async ({ templateName, email, values }) => {
    console.log(templateName, email, values);
    const [html, text, subject] = await Promise.all([
      this.renderTemplate(templateName, "html", values),
      this.renderTemplate(templateName, "text", values),
      this.renderTemplate(templateName, "subject", values),
    ]);

    const request = {
      Source: this.senderAddress,
      Destination: {
        ToAddresses: Array.isArray(email) ? email : [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: juice(html, this.juiceOptions),
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
    await this.performSend(request);
  };
};
