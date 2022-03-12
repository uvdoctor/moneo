const { sendEmail } = require("./EmailSender");

const yhigh = [ { name: "HDFC" }]
const ylow = [ {name: "ICICI"} ]
const gainers = [ { name: "SAIL" } ]
const losers = [{ name: "COAL" }]
const change = 3.32;

sendEmail({
  templateName: "alerts",
  email: 'mehzabeen1526@gmail.com',
  values: {
    url: "https://moneo.in/get",
    gainers: gainers,
    losers: losers,
    yhigh: yhigh,
    ylow: ylow,
    chg: change,
    chgImpact: "up"
  },
}).then((data) => {
  console.log("Compeleted", data);
});
