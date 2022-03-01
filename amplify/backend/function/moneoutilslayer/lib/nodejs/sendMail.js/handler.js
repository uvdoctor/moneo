const EmailSender = require("./EmailSender");

const sender = new EmailSender("noreply <no-reply@moneo.money>");

sender
  .send({
    templateName: "weekHL",
    email: "mehzabeen1526@gmail.com",
    values: {
      name: "",
      url: "https://moneo.in/get",
      count: 1,
      data: [ { sid:"JETAIRWAYS", ylow: 12 }, { sid:"HDFC", yhigh: 12 }  ]
    },
  })
  .then((data) => {
    console.log("sdhbfhdbsjf", data);
  });
