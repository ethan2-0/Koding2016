from flask import Flask
app = Flask(__name__)

@app.route("/")
def serveRoot():
    with open("index.html", "r") as f:
        return f.read()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
