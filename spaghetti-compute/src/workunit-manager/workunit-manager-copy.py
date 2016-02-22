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
		config = requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/config/work_unit_manager").json()
		self.buffer_len = config["buffer_len"]
		self.uuid = jobUUID
		self.buffer = []
		self.callback = callback
		workunits = requests.get(callback + "workunits?amt=" + str(self.buffer_len)).json()
		for workunit in workunits["result"]:
			appendedWorkUnit = {
				"job_uuid": self.uuid,
				"workunit_id" : workunit["uuid"],
				"workunit_data" : workunit["data"]
			}
			appendedWorkUnit["job_uuid"] = self.uuid
			appendedWorkUnit["workunit_id"] = workunit["uuid"]
			appendedWorkUnit["workunit_data"] = workunit["data"]
			self.buffer.append(appendedWorkUnit)
		jobs.append(self)

	def refill(self, count):
		workunits = requests.get(self.callback + "workunits?amt=" + str(count)).json()
		for workunit in workunits["result"]:
			appendedWorkUnit = {
				""
			}
			appendedWorkUnit["job_uuid"] = self.uuid
			appendedWorkUnit["workunit_id"] = workunit["uuid"]
			appendedWorkUnit["workunit_data"] = workunit["data"]
			self.buffer.append(appendedWorkUnit)

	def getWorkUnit(self):
		if len(self.buffer) <= 0:
			self.refill()
		return self.buffer.pop(0)

for job in json.loads(requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/jobs").text)["jobs"]:
	print("--------" + str(job))
	jobs.append(Job(job["uuid"], job["callback"]))

@app.route("/workunit/get", methods=["POST"])
def getWorkUnit():
	request_body = request.data
	json_object = None
	try:
		json_object = json.loads(request_body)
	except:
		return "nice try, but it's not a json"
	if not hasAllValues(json_object, "prefix", "mac", "time", "suffix"):
		return "nice try, but your json is missing data"
	else:
		proofOfWorkResponse = proofofwork.ProofOfWorkResponse.fromJson(json_object)
		if not proofOfWorkResponse.isValid():
			return "nice try, but your suffix is wrong"
		else:
			return jsonify(random.choice(jobs).getWorkUnit())

@app.route("/js/<uuid>", methods=["GET"])
def getJS(uuid):
	try:
		return str(js[uuid])
	except:
		javascript = requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/js/" + uuid).text
		print(javascript)
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
