from flask import Flask, jsonify, request
import json
import random

impl = None
config = None
with open("config.json", "r") as f:
    config = json.loads(f.read())

def getRandomData(amt):
    chars = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTUIOPASDFGHJKLZXCVBNM"
    return "".join([random.choice(x) for x in [chars] * amt])

app = Flask(__name__)

workunits = []

class WorkUnit:
    def __init__(self, data):
        self.uuid = getRandomData(32)
        self.job_uuid = config["job_uuid"]
        self.data = data
        self.response = None
    def getJson(self):
        return {
            "uuid": self.uuid,
            "data": self.data
        }
    @staticmethod
    def fromDoneRequest(requestURL):
        return WorkUnit()

def setWorkUnitImpl(newImpl):
    global impl
    impl = newImpl

@app.route("/")
def serveRoot():
    return "Hi."
@app.route("/workunits")
def serveWorkunits():
    global workunits
    numWorkunits = request.args.get("amt")
    if numWorkunits is None:
        return "The query string must be of the form '?amt=<amt>', where <amt> is the number of workunits you want."
    units = [impl.getWorkUnit() for i in range(int(numWorkunits))]
    workunits += units
    res = {
        "result": [wu.getJson() for wu in units]
    }
    return jsonify(res)
@app.route("/done", methods=["POST"])
def serveDone():
    reqJson = json.loads(request.data)
    workunit = None
    for wu in workunits:
        if wu.uuid == reqJson["workunit_id"]:
            workunit = wu
    if workunit is None:
        return "ERROR: Unknown uuid %s" % reqJson["workunit_id"]
    workunit.response = reqJson["response"]
    impl.handleWorkUnit(workunit)
    return "yay"

def run():
    app.run(debug=True, port=5004, host="0.0.0.0")