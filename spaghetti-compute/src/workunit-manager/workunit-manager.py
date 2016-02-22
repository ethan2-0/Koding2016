# import Flask, request, json utils, CORS, requests, and random
from flask import Flask, request, jsonify, json
from flask.ext.cors import CORS
import requests
import random

# import the proof of work code from proofofwork.py
import proofofwork

# create the app and CORSify it
app = Flask(__name__)
CORS(app)

jobs = [] # A list of the jobs

js = {} # The JavaScript

class Job:
	def __init__(self, jobUUID, callback):
		print("init job %s ==> %s" %(jobUUID, callback))
		config = requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/config/work_unit_manager").json()
		self.buffer_len = config["buffer_len"]
		self.critical_buffer_len = config["critical_buffer_len"]
		self.uuid = jobUUID
		self.buffer = []
		self.callback = callback
		workunits = requests.get(callback + "workunits?amt=" + str(self.buffer_len)).json()
		self.refill(self.buffer_len)
		jobs.append(self)

	def refill(self, count):
		print("refilling buffer (%s) to minimum length %s" %(self.uuid, count))
		workunits = requests.get(self.callback + "workunits?amt=" + str(count - len(self.buffer))).json()
		for workunit in workunits["result"]:
			self.buffer.append({
				"job_uuid": self.uuid,
				"workunit_id" : workunit["uuid"],
				"workunit_data" : workunit["data"]
			})

	def getWorkUnit(self):
		print("work unit requested; %s remaining" %(len(self.buffer)))
		if len(self.buffer) <= self.critical_buffer_len:
			self.refill(self.buffer_len)
		return self.buffer.pop(0)

for job in requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/jobs").json()["jobs"]:
	jobs.append(Job(job["uuid"], job["callback"]))

@app.route("/")
def serveRoot():
	return "WorkUnit Manager"

@app.route("/workunit/get", methods=["POST"])
def getWorkUnit():
	request_body = request.data
	json_object = None
	try:
		json_object = json.loads(request_body)
	except:
		return "Error: request body is not a JSON"
	if not hasAllValues(json_object, "prefix", "mac", "time", "suffix"):
		return "Error: JSON must have the following entries: <prefix:string> <mac:string> <time:int> <suffix:int>"
	else:
		print json_object
		proofOfWorkResponse = proofofwork.ProofOfWorkResponse.fromJson(json_object)
		if not proofOfWorkResponse.isValid():
			return "Error: suffix does not provide the correct solution"
		else:
			return jsonify(random.choice(jobs).getWorkUnit())

@app.route("/js/<uuid>", methods=["GET"])
def getJS(uuid):
	try:
		return str(js[uuid])
	except:
		javascript = requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/js/" + uuid).text
		js[uuid] = javascript
		return str(js[uuid])

@app.route("/proofofwork/get", methods=["GET"])
def proofOfWork():
	return jsonify(proofofwork.ProofOfWorkRequest.generate().getJson())

def hasAllValues(json_object, *keys):
	for key in keys:
		try:
			value = json_object[key]
		except:
			return False
	return True

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0", port=5002)
