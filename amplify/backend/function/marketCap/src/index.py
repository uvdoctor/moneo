import subprocess
import os
import json
from data import apiArray,getData
from pushData import pushData
isinMap = {}
table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev"

def getAndPushData():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    for i in range(len(apiArray)):
        url = apiArray[i]["url"]
        mcap = apiArray[i]["mcap"]
        indices = apiArray[i]["indices"]
        p1 = subprocess.Popen('curl '+url+' -H "authority: beta.nseindia.com" -H "cache-control: max-age=0" -H "dnt: 1" -H "upgrade-insecure-requests: 1" -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36" -H "sec-fetch-user: ?1" -H "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9" -H "sec-fetch-site: none" -H "sec-fetch-mode: navigate" -H "accept-encoding: gzip, deflate, br" -H "accept-language: en-US,en;q=0.9,hi;q=0.8" --compressed  -o maxpain.txt', shell=True)
        p1.wait()
        f=open("maxpain.txt","r")
        var=f.read()
        data = json.loads(var)
        dataToPush = getData(isinMap, data, mcap, indices, table)
        pushData(table, dataToPush)

getAndPushData()
def handler(event, context):
    # os.chdir(os.path.dirname(os.path.abspath(__file__)))
    # p1 = subprocess.Popen('curl "https://www.nseindia.com/api/allIndices" -H "authority: beta.nseindia.com" -H "cache-control: max-age=0" -H "dnt: 1" -H "upgrade-insecure-requests: 1" -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36" -H "sec-fetch-user: ?1" -H "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9" -H "sec-fetch-site: none" -H "sec-fetch-mode: navigate" -H "accept-encoding: gzip, deflate, br" -H "accept-language: en-US,en;q=0.9,hi;q=0.8" --compressed  -o maxpain.txt', shell=True)
    # p1.wait()
    # f=open("maxpain.txt","r")
    # var=f.read()
    # print(json.loads(var))
    # return json.loads(var)
    getAndPushData()