import requests
import hashlib
import json

powreq = requests.get("http://69112165.ngrok.io/proofofwork/get").json()
ctr = 0

print powreq
print "Got proof of work, solving proof of work..."
while hashlib.sha384("%s%s" % (powreq["prefix"], ctr)).hexdigest()[:4] != "0000":
    ctr += 1

print requests.post("http://69112165.ngrok.io/workunit/get", data=json.dumps({
    "prefix": powreq["prefix"],
    "mac": powreq["mac"],
    "time": powreq["time"],
    "suffix": "%s" % ctr
})).text
