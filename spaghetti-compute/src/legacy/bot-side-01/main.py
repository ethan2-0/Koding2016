from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route("/")
def serveRoot():
    return render_template("container.html")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5003)
