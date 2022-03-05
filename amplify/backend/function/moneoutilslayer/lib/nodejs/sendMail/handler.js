const { send: sendEmail } = require("./EmailSender");

const yhigh = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];
const ylow = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];

sendEmail({
  templateName: "weekHL",
  email: ["mehzabeen1526@gmail.com"],
  values: {
    url: "https://moneo.in/get",
    yhighCount: yhigh.length,
    ylowCount: ylow.length,
    yhigh: yhigh,
    ylow: ylow,
  },
}).then((data) => {
  console.log("Compeleted", data);
});
