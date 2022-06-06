const { watchlistValuation
} = require("../lib/nodejs/watchlistVal");


describe("Test instrumentValuation", () => {
  test("With hight", () => {
    const data = watchlistValuation({ GAIL: { price: 100, name: "GAIL" } },  [ { id: "GAIL", hight: 100 } ]);
    expect(data).toEqual({"buy": [], "sell": [{"name": "GAIL"}]} );
  });

  test("With lowt", () => {
    const data = watchlistValuation({ GAIL: { price: 100, name: "GAIL" } },  [ { id: "GAIL", lowt: 100 } ]);
    expect(data).toEqual({"buy": [{"name": "GAIL"}], "sell": []} );
  });

  test("No hight-lowt", () => {
    const data = watchlistValuation({ GAIL: { price: 100, name: "GAIL" } },  [ { id: "GAIL" } ]);
    expect(data).toEqual({"buy": [], "sell": []} );
  });
});

