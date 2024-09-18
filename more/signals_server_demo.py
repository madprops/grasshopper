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

# Delay to wait for metadata to update
metadata_delay = "0.2"


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


def max_volume():
    run(["awesome-client", "Utils.max_volume()"])


def min_volume():
    run(["awesome-client", "Utils.min_volume()"])


def get_metadata(what):
    result = output([*player, "metadata", "--format", what])
    return result.stdout.decode("utf-8").strip()


def metadata():
    artist = get_metadata("{{artist}}")
    title = get_metadata("{{title}}")

    if artist and title:
        info = f"{artist} - {title}"
    elif artist:
        info = artist
    elif title:
        info = title
    else:
        info = "Not Playing"

    return info


# ----------


@app.route("/music-play", methods=["POST"])
def music_play():
    music("play-pause")
    return "ok"


@app.route("/music-next", methods=["POST"])
def music_next():
    music("next")
    run(["sleep", metadata_delay])
    return metadata()


@app.route("/music-prev", methods=["POST"])
def music_prev():
    run(["sleep", metadata_delay])
    return metadata()


@app.route("/volume-up", methods=["POST"])
def volume_up():
    inc_volume()
    return "ok"


@app.route("/volume-down", methods=["POST"])
def volume_down():
    dec_volume()
    return "ok"


@app.route("/volume-max", methods=["POST"])
def volume_max():
    max_volume()
    return "ok"


@app.route("/volume-min", methods=["POST"])
def volume_min():
    min_volume()
    return "ok"


@app.route("/music-np", methods=["GET"])
def music_np():
    return metadata()


@app.route("/post-test", methods=["POST"])
def post_test():
    num = request.json.get("num")
    return f"You sent {num}"


# ----------


# Start the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=debug)