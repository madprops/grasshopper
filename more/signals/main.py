import json
import subprocess
from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from pathlib import Path


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
metadata_delay = "0.18"

# Where to save tab backups
backup_path = Path("~/.config/signals/backups").expanduser()

# Seconds to seek forwards or backwards
seek_time = 5


# ----------


def run(args):
    subprocess.run(args)


def output(args):
    return subprocess.run(args, capture_output=True)


def get_arg(name):
    return request.json.get(name)


def get_seconds():
    return int(datetime.now().timestamp())


def sleep(secs):
    run(["sleep", secs])


def music(what):
    run([*player, *what])


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
    info = ""
    status = player_status()

    if status == "Playing":
        artist = get_metadata("{{artist}}")
        title = get_metadata("{{title}}")

        if artist and title:
            info = f"{artist} - {title}"
        elif artist:
            info = artist
        elif title:
            info = title

    return info


def player_status():
    result = output([*player, "status"])
    return result.stdout.decode("utf-8").strip()


def save_backup(what, data):
    tabs = get_arg(what)
    secs = get_seconds()
    name = f"{what}_{secs}.json"
    path = backup_path / name

    if not path.parent.exists():
        path.parent.mkdir(parents=True)

    with path.open("w") as f:
        json.dump(tabs, f)


def get_backup(what):
    text = ""

    if backup_path.parent.exists():
        files = sorted(backup_path.glob(f"{what}_*.json"))

        if files:
            with files[-1].open() as f:
                line = json.load(f)
                text = json.dumps(line, indent=2)

    return text


# ----------


@app.route("/music-play", methods=["POST"])
def music_play():
    music(["play-pause"])
    return "ok"


@app.route("/music-next", methods=["POST"])
def music_next():
    music(["next"])
    sleep(metadata_delay)
    return metadata()


@app.route("/music-prev", methods=["POST"])
def music_prev():
    music(["previous"])
    sleep(metadata_delay)
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


@app.route("/music-seek-forwards", methods=["POST"])
def music_seek_f():
    music(["position", f"{seek_time}+"])
    return "ok"


@app.route("/music-seek-backwards", methods=["POST"])
def music_seek_b():
    music(["position", f"{seek_time}-"])
    return "ok"


# ------------


@app.route("/post-backup-tabs", methods=["POST"])
def post_backup_tabs():
    msg = ""

    if request.content_type == "application/json":
        data = get_arg("tabs")

        if data:
            save_backup("tabs", data)
            msg = "Tabs Saved"

    if not msg:
        msg = "You sent nothing"

    return msg


@app.route("/get-backup-tabs", methods=["GET"])
def get_backup_backup():
    msg = get_backup("tabs")

    if not msg:
        msg = "No Tabs"

    return msg


@app.route("/post-backup-settings", methods=["POST"])
def post_backup_settings():
    msg = ""

    if request.content_type == "application/json":
        data = get_arg("settings")

        if data:
            save_backup("settings", data)
            msg = "Settings Saved"

    if not msg:
        msg = "You sent nothing"

    return msg


@app.route("/get-backup-settings", methods=["GET"])
def get_backups_settings():
    msg = get_backup("settings")

    if not msg:
        msg = "No Settings"

    return msg


@app.route("/active-test", methods=["POST"])
def active_test():
    msg = ""

    if request.content_type == "application/json":
        data = get_arg("active")
        print(data)
        msg = f"URL: {data["url"]} | Pinned: {data["pinned"]}"

    if not msg:
        msg = "You sent nothing"

    return msg


# ----------


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=debug)
