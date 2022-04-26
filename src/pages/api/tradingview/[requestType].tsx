import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
const eodKey = "61ff9bf3d40797.93512142";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { requestType, symbol, to, countback } = req.query;
  let data: any;

  if (requestType === "config") {
    data = getConfig();
    res.send(data);
  } else if (requestType === "time") {
    res.send(new Date().getTime());
  } else if (requestType === "symbols") {
    const response = await fetch(
      `https://eodhistoricaldata.com/api/fundamentals/${symbol}.NSE?api_token=${eodKey}`
    );

    data = await response.json();

    res.send({
      name: symbol,
      "exchange-traded": data.General.Exchange,
      "exchange-listed": data.General.Exchange,
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      session: "0930-1630",
      has_intraday: false,
      has_no_volume: false,
      description: data.General.Name,
      type: "stock",
      supported_resolutions: ["D", "2D", "3D", "W", "3W", "M", "6M"],
      pricescale: 100,
      ticker: symbol,
    });
  } else if (requestType === "history") {
    data = await getSymbolData(symbol, to, countback);
    res.send(data);
  }
};

function getConfig() {
  return {
    supports_search: true,
    supports_group_request: false,
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true,
    exchanges: [
      { value: "", name: "All Exchanges", desc: "" },
      { value: "NasdaqNM", name: "NasdaqNM", desc: "NasdaqNM" },
      { value: "NYSE", name: "NYSE", desc: "NYSE" },
      { value: "NCM", name: "NCM", desc: "NCM" },
      { value: "NGM", name: "NGM", desc: "NGM" },
      { value: "BSE", name: "BSE", desc: "BSE" },
      { value: "NSE", name: "NSE", desc: "NSE" },
    ],
    symbols_types: [
      { name: "All types", value: "" },
      { name: "Stock", value: "stock" },
      { name: "Index", value: "index" },
    ],
    supported_resolutions: ["D", "W", "M"],
  };
}

function stringToEODDate(timeStamp: any) {
  const date = new Date(parseInt(timeStamp));
  //date.setUTCSeconds(parseInt(UTCSeconds));

  let day: any = date.getDate();
  day = day.toString().length === 1 ? `0${day}` : day;

  let month: any = date.getMonth() + 1;
  month = month.toString().length === 1 ? `0${month}` : month;

  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function getSymbolData(symbol: any, to: any, countback: any) {
  return new Promise(async (resolve, reject) => {
    try {
      if (to.length === 10) to += "000";

      const toDateStr = stringToEODDate(to);
      const fromDate = new Date(parseInt(to));

      fromDate.setDate(fromDate.getDate() - countback);
      const fromDateStr = stringToEODDate(fromDate.getTime());

      const response = await fetch(
        `https://eodhistoricaldata.com/api/eod/${symbol}.NSE?api_token=${eodKey}&fmt=json&period=d&from=${fromDateStr}&to=${toDateStr}&order=a`
      );
      const data = await response.json();
      const t = [];
      const o = [];
      const c = [];
      const h = [];
      const l = [];
      const v = [];
      const dataLength = data.length;

      if (dataLength === 0) {
        resolve({
          s: "no_data",
        });

        return;
      }

      for (let i = 0; i < dataLength; i++) {
        const { date, open, high, low, close, volume } = data[i];

        t.push(new Date(date).getTime() / 1000);
        o.push(open);
        c.push(close);
        h.push(high);
        l.push(low);
        v.push(volume);
      }

      resolve({
        t,
        o,
        c,
        h,
        l,
        v,
        s: "ok",
      });
    } catch (err) {
      reject(err);
    }
  });
}
