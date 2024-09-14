import subprocess
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


def music(what):
    subprocess.run(["playerctl", "-p", "audacious", what])


@app.route("/music-play", methods=["POST"])
def music_play():
    music("play-pause")
    return "ok"


@app.route("/music-next", methods=["POST"])
def music_next():
    music("next")
    return "ok"


@app.route("/music-prev", methods=["POST"])
def music_prev():
    music("previous")
    return "ok"


@app.route("/music-np", methods=["GET"])
def music_np():
    np = subprocess.run(["playerctl", "metadata", "-p", "audacious", "--format", "{{ artist }} - {{ title }}"], capture_output=True)
    return np.stdout.decode("utf-8")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)