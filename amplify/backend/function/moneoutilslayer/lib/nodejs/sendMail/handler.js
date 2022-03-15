const { sendEmail } = require("./EmailSender");

const yhigh = [ { name: "HDFC" }]
const ylow = [ {name: "ICICI"} ]
const gainers = [ { name: "SAIL" } ]
const losers = [{ name: "COAL" }]
const metal = [{ name: "Gold", price: "12672", up: true, chg: "7.3" }, { name: "Silver", price: "12345", up: false, chg: "6.3" }]
const change = 3.32;
const chgAmount = 400000;

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
    chgAmount: chgAmount,
    chgImpact: false,
    metal: metal
  },
}).then((data) => {
  console.log("Compeleted", data);
});
