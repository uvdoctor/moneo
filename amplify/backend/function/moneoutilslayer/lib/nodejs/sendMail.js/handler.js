const { send } = require("./EmailSender");

const yhigh = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];
const ylow = ["JETAIRWAYS", "HDFC", "ICICI", "JPOWER"];

send({
  templateName: "weekHL",
  email: ["mehzabeen1526@gmail.com"],
  values: {
    name: "Mehzabeen",
    url: "https://moneo.in/get",
    yhighCount: yhigh.length,
    ylowCount: ylow.length,
    yhigh: yhigh,
    ylow: ylow,
  },
}).then((data) => {
  console.log("Compeleted", data);
});
