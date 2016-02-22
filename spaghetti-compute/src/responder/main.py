# This is the responder specified by 3.1 here:
# https://docs.google.com/document/d/11tjjmdhtRlQwYnwBur3uXgd_vaUxbiv6UqIxPuFkjZk/edit

from flask import Flask, request, jsonify, json
from flask.ext.cors import CORS
import proofofwork
import requests

def doLog(text):
	with open("a.txt", "a") as f:
		f.write(text)
with open("a.txt", "w") as f:
	f.write("Cleared")

app = Flask(__name__)
CORS(app)

@app.route("/")
def serveRoot():
	return "Responder"

@app.route("/done", methods=["POST"])
def done():
	request_body = request.data
	doLog("Request-body: %s\n\n" % request_body)
	json_object = None
	try:
		json_object = json.loads(request_body)
	except:
		return "Failure creating JSON object from string: " + request_body

	if hasAllValues(json_object, "job_uuid", "workunit_id", "response", "proof_of_work") and hasAllValues(json_object["proof_of_work"], "prefix", "mac", "suffix"):
		if proofofwork.ProofOfWorkResponse(json_object["proof_of_work"]).isValid():
			for job in requests.get("http://ueks277167ba.ethan2-0.koding.io:5000/jobs").json()["jobs"]:
				if job["uuid"] == json_object["job_uuid"]:
					requests.post(job["callback"] + "done", data=json.dumps({"workunit_id": json_object["workunit_id"], "response": json_object["response"]}))
					return "yay"
		else:
			return "You did not prove your work"
	else:
		return "Request body is missing keys"
		doLog("ReqBody")
		return "Failure creating JSON object from string"

def hasAllValues(json_object, *keys):
	for key in keys:
		try:
			value = json_object[key]
		except:
			return False
	return True

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0", port=5001)
