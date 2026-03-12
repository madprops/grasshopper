`git clone` the repo.

Use `./utils/prepare_firefox.sh` or `./utils/prepare_chrome.sh`.

Do this to bundle the `js` files and to use the proper `manifest` file.

This is because all the js files are bundled into 2 main files.

And `chrome` and `firefox` can't use the same manifest file for now.

Load the extension in `about:debugging` or `about:extensions`.

On changes `reload` the extension. On some cases you might have to remove it and load it again.

You can reload on the browser addon page, or using the `Restart` command, or toggling the sidebar or popup.

When doing a release use `./utils/make_firefox.sh` or `./utils/make_chrome.sh`.