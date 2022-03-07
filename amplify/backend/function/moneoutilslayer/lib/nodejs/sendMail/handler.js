const { sendEmail } = require("./EmailSender");

const yhigh = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];
const ylow = [];
const gainers = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];
const losers = [];

sendEmail({
  templateName: "weekHL",
  email: ["mehzabeen1526@gmail.com"],
  values: {
    url: "https://moneo.in/get",
    gainers: gainers,
    losers: losers,
    yhigh: yhigh,
    ylow: ylow,
  },
}).then((data) => {
  console.log("Compeleted", data);
});
