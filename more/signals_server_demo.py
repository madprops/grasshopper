# This is a simple webserver to listen to signals from the browser
# It mostly does music and volume operations, but can be extended

# requirements.txt:
# -----------------
# Flask == 3.0.3
# Flask-Cors == 4.0.1


import subprocess
from flask import Flask, request
from flask_cors import CORS


# ----------


# Main flask app
app = Flask(__name__)

# Allow cross-origin requests
CORS(app)

# The port to run the server on
port = 5000

# Enable debug mode
debug = False

# Your music player
player = ["playerctl", "-p", "audacious"]

# Format when returning metadata
track_info = "{{artist}} - {{title}}"


# ----------


def run(args):
    subprocess.run(args)


def output(args):
    return subprocess.run(args, capture_output=True)


def music(what):
    run([*player, what])


def inc_volume():
    run(["awesome-client", "Utils.increase_volume()"])


def dec_volume():
    run(["awesome-client", "Utils.decrease_volume()"])


def metadata(what):
    ans = output([*player, "metadata", "--format", what])
    text = ans.stdout.decode("utf-8").strip()

    if text == "-":
        text = "Not Playing"

    return text


# ----------


@app.route("/music-play", methods=["POST"])
def music_play():
    music("play-pause")
    return "ok"


@app.route("/music-next", methods=["POST"])
def music_next():
    music("next")
    return metadata(track_info)


@app.route("/music-prev", methods=["POST"])
def music_prev():
    music("previous")
    return metadata(track_info)


@app.route("/volume-up", methods=["POST"])
def volume_up():
    inc_volume()
    return "ok"


@app.route("/volume-down", methods=["POST"])
def volume_down():
    dec_volume()
    return "ok"


@app.route("/music-np", methods=["GET"])
def music_np():
    return metadata(track_info)


@app.route("/post-test", methods=["POST"])
def post_test():
    num = request.json.get("num")
    return f"You sent {num}"


# ----------


# Start the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=debug)