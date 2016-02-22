# This is the Ringleader server

from flask import Flask, jsonify, json, send_file
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)

configs = None

with open("config.json") as f:
	configs = json.loads(f.read())

@app.route("/")
def serveRoot():
	return "Ringleader"

@app.route("/jobs", methods=["GET"]) # Gets the jobs
def getJobs():
	try:
		with open("jobs.json", "r") as f:
			return f.read()
	except:
		return "No Jobs!?!?"

@app.route("/config", methods=["GET"]) # Gets the global configurations
def getGlobalConfiguration():
	return jsonify(configs)

@app.route("/config/<key>", methods=["GET"]) # Gets the global configuration <key:value>
def getLocalConfiguration(key):
	return jsonify(configs[key])

@app.route("/js/<UUID>", methods=["GET"]) # Gets the JS for a job
def getJob(UUID):
	content = None
	try:
		with open("jobsJS/" + UUID + ".js") as f:
			content = f.read()
	except:
		print("No js for that file")
	return content

if __name__ == "__main__":
	app.run(debug=False, host='0.0.0.0', port=5000)
