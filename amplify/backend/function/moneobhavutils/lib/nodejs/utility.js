const utils = (num) => {
  if (!num) num = 0;
  const monthsArray = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const today = new Date();
  const monthChar = monthsArray[today.getMonth()];
  const yearFull = today.getFullYear();
  const todayDate = today.getDate() - parseInt(num);
  const date = todayDate < 10 ? `0${todayDate}` : todayDate;
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;

  return { date, month, monthChar, yearFull };
};

module.exports = utils;
