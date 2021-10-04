import math
from datetime import datetime

apiArray = [
    {"url": "https://www.nseindia.com/api/etf", "mcap": "null", "indices": "ETF"},
    {"url": "https://www.nseindia.com/api/sovereign-gold-bonds",
        "mcap": "null", "indices": "SGB"},
    {"url": "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDCAP%20150",
        "mcap": "M", "indices": "NIFTY MIDCAP 150"},
    {"url": "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20LARGEMIDCAP%20250",
        "mcap": "L", "indices": "NIFTY LARGEMIDCAP 250"},
    {"url": "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY500%20MULTICAP%2050:25:25",
        "mcap": "S", "indices": "NIFTY MULTICAP 50:25:25"}
]


def getData(isinMap, data, mcap, indices, table):
    batches = []
    for i in range(len(data)):
        if(i == 0 and mcap != "null"):
            i += 1
            continue
        try:
          isinMap[data[i]["meta"]["isin"]]
          i+=1
          continue
        except:
          pass

        schema = {
            "id": data[i]["meta"]["isin"],
            "mcap": mcap,
            "mchg": data[i]["perChange30d"],
            "ychg": data[i]["perChange365d"],
        }
        if(mcap == "null"):
            yhigh = float(data[i]["wkhi"])
            ylow = float(data[i]["wklo"])
            schema["yhigh"] = math.floor(yhigh) * 100 / 100
            schema["ylow"] = math.floor(ylow) * 100 / 100
            if (indices == "ETF"):
                schema["index"] = data[i]["assets"]
        else:
            yhigh = float(data[i]["yearHigh"])
            ylow = float(data[i]["yearLow"])
            schema["ind"] = data[i]["meta"]["industry"]
            schema["yhigh"] = math.floor(yhigh) * 100 / 100
            schema["ylow"] = math.floor(ylow) * 100 / 100
            schema["index"] = indices
        schema["__typename"] = table[slice(0, table.index("-"))]
        schema["updatedAt"] = datetime.now().isoformat()
        isinMap[data[i]["meta"]["isin"]] = data[i]["meta"]["isin"]
        batches.append(schema)
    print(len(batches))
    print(len(isinMap),"isinmap")
    return batches

# def getData(isinMap, data, mcap, indices, table):
#     batches = []
#     # try:
#     i=0
#     while i<len(data):
#       if(i == 0 and mcap != None):
#         print("okay")
#         i+=1
#         continue
#       print("on schema")
#       schema = {
#         "id": data[i]["meta"]["isin"],
#         "mcap": mcap,
#         "mchg": data[i]["perChange30d"],
#         "ychg": data[i]["perChange365d"],
#       }
#       print(batches)
#       if(mcap == None):
#         schema["yhigh"] = math.floor(
#           data[i]["wkhi"] * 100) / 100
#         schema["ylow"] = math.floor(
#           data[i]["wklo"] * 100) / 100
#         if (indices == "ETF"):
#           schema["index"] = data[i]["assets"]
#       else:
#         schema["yhigh"] = math.floor(
#           data[i]["yearHigh"] * 100) / 100
#         schema["ylow"] = math.floor(
#           data[i]["yearLow"] * 100) / 100
#         schema["index"] = indices
#       print(schema)
#       schema["ind"] = data[i]["meta"]["industry"]
#       schema["__typename"] = table[slice(0, table.index("-"))]
#       schema["updatedAt"] = datetime.now().isoformat()
#       print("Schema" , i , schema)
#       batches.append(schema)
#       i+=1
#   # except:
#   #     print("Something went wrong")
#     return batches
