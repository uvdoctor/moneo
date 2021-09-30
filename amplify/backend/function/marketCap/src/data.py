import math
from datetime import datetime

apiArray = [
{"url": "https://www.nseindia.com/api/sovereign-gold-bonds", "mcap":None, "indices":"SGB"},
{"url":"https://www.nseindia.com/api/etf", "mcap":None, "indices":"ETF"}, 
{"url":"https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDCAP%20150" , "mcap":"M", "indices": "NIFTY MIDCAP 150"},
{"url":"https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20LARGEMIDCAP%20250", "mcap":"L", "indices":"NIFTY LARGEMIDCAP 250"},
{"url":"https://www.nseindia.com/api/equity-stockIndices?index=NIFTY500%20MULTICAP%2050:25:25", "mcap":"S", "indices":"NIFTY MULTICAP 50:25:25"}
]

def getData(isinMap, data, mcap, indices, table):
  batches = []
  for i in range(len(data)):
    if(i==0 and mcap!=None):
      continue;
    if (isinMap[data[i]["meta"]["isin"]]):
      continue;
    schema = {
      "id": data[i]["meta"]["isin"],
      "mcap": mcap,
      "mchg": data[i]["perChange30d"],
      "ychg": data[i]["perChange365d"],
    }
    if(mcap == None):
      schema["yhigh"] = math.round(data[i]["wkhi"] * 100) / 100
      schema["ylow"] = math.round(data[i]["wklo"] * 100) / 100
      if (indices == "ETF"):
          schema["index"] = data[i]["assets"];
    else:
      schema["yhigh"] = math.round(data[i]["yearHigh"] * 100) / 100
      schema["ylow"] = math.round(data[i]["yearLow"] * 100) / 100
      schema["index"] = indices
    schema["ind"] = data[i]["meta"]["industry"]
    schema["__typename"] = table[slice(0, table.index("-"))]
    schema["updatedAt"] = datetime.now().isoformat()
    isinMap[data[i]["meta"]["isin"]] = data[i]["meta"]["isin"]
    batches.append(schema)
  return batches



    
  