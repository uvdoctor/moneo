const { sendEmail } = require("./EmailSender");
const { toHumanFriendlyCurrency } = require("../utility");
const yhigh = [ { name: "HDFC" }]
const ylow = [ {name: "ICICI"} ]
const gainers = [ { name: "SAIL" } ]
const losers = [{ name: "COAL" }]
const metal = [{ name: "10 grams of 24k gold:", price: "12672", up: true, chg: "7.3" }, { name: "10 grams of 99.99% Silver", price: "12345", up: false, chg: "6.3" }]
const chgAmount = 400000;
const valuation = toHumanFriendlyCurrency(10000000, "INR");
const buy = [{ name: "HDFC" }, { name: "ICICI" }];
const sell = [{ name: "IDFC" }, { name: "SBI" }];

// sendEmail({
//   templateName: "pricealerts",
//   email: 'mehzabeen1526@gmail.com',
//   values: {
//     gainers: gainers,
//     losers: losers,
//     yhigh: yhigh,
//     ylow: ylow,
//     valuation: valuation,
//     chgAmount: chgAmount,
//     chgImpact: false,
//     metal: metal
//   },
// }).then((data) => {
//   console.log("Compeleted price alert: ", data);
// });

// sendEmail({
//   templateName: "watchalerts",
//   email: 'mehzabeen1526@gmail.com',
//   values: {
//     buy: buy,
//     sell: sell
//   },
// }).then((data) => {
//   console.log("Compeleted watch alert: ", data);
// });

sendEmail({
  templateName: "coachingreq",
  email: 'mehzabeen1526@gmail.com',
  values: {
   owner: false,
   mob: 82685520515,
   email: "www.google.com",
   text:'Hii',
   duration: 30,
   user: "mehza5454"
  },
}).then((data) => {
  console.log("Compeleted watch alert: ", data);
});
